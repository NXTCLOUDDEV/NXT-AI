import {Hono} from "hono";
import type {Env} from "./env";
import {Db} from "./db/repository";
import {TaskService} from "./tasks/service";
import {createModelRouter} from "./models/router";

function auth(c:any):{organizationId:string;userId?:string}|Response{
  const required=c.env.ENVIRONMENT==="production";
  const key=c.req.header("authorization")?.replace(/^Bearer\s+/i,"");
  if(required && (!c.env.NXT_API_KEY || key!==c.env.NXT_API_KEY)) return c.json({error:{code:"UNAUTHORIZED",message:"Authentication required"}},401);
  return {organizationId:c.req.header("x-organization-id")??"default",userId:c.req.header("x-user-id")??undefined};
}

type Identity={organizationId:string;userId?:string};
export const api=new Hono<{Bindings:Env;Variables:{identity:Identity}}>();
api.use("*",async(c,next)=>{const a=auth(c);if(a instanceof Response)return a; c.set("identity",a as Identity);await next();});

api.get("/models",c=>c.json({data:[{provider:"openai",configured:Boolean(c.env.OPENAI_API_KEY)},{provider:"anthropic",configured:Boolean(c.env.ANTHROPIC_API_KEY)}]}));
api.get("/usage",async c=>{const identity=c.get("identity");return c.json({data:(await new Db(c.env).usageSummary(identity.organizationId)).results});});

api.post("/chat",async c=>{
  const identity=c.get("identity");
  const body=await c.req.json<{messages?:Array<{role:"system"|"user"|"assistant"|"tool";content:string}>;message?:string;provider?:string;model?:string}>();
  const messages=body.messages??(body.message?[{role:"user",content:body.message}]:[]);
  if(messages.length===0)return c.json({error:{code:"VALIDATION_ERROR",message:"message or messages is required"}},400);
  const provider=body.provider??c.env.NXT_DEFAULT_PROVIDER??"openai";const providers=[provider,...(c.env.NXT_FALLBACK_PROVIDER?[c.env.NXT_FALLBACK_PROVIDER]:[])];
  try{const started=Date.now();const out=await createModelRouter(c.env).generateWithFallback(providers,{messages,model:body.model??c.env.NXT_DEFAULT_MODEL});const db=new Db(c.env);const inputTokens=out.usage?.inputTokens??0;const outputTokens=out.usage?.outputTokens??0;const inputRate=Number(c.env.NXT_COST_INPUT_PER_MILLION??0);const outputRate=Number(c.env.NXT_COST_OUTPUT_PER_MILLION??0);const costUsd=(inputTokens*inputRate+outputTokens*outputRate)/1_000_000;await db.addUsage(identity.organizationId,provider,out.model,inputTokens,outputTokens,Date.now()-started,costUsd);return c.json({data:{text:out.text,model:out.model,provider:out.provider,usage:out.usage}});}
  catch(error){return c.json({error:{code:"PROVIDER_ERROR",message:error instanceof Error?error.message:"Model provider failed",retryable:true}},502);}
});

api.post("/tasks",async c=>{
  const identity=c.get("identity");
  const body=await c.req.json<{input?:string}>();
  if(typeof body.input!=="string"||body.input.trim().length===0)return c.json({error:{code:"VALIDATION_ERROR",message:"input is required"}},400);
  const taskId=await new TaskService(c.env).create(identity.organizationId,body.input.trim());
  await c.env.TASKS.send({taskId});
  return c.json({id:taskId,status:"queued"},202);
});

api.get("/tasks/:id",async c=>{const identity=c.get("identity") as {organizationId:string};const row=await new Db(c.env).getTask(identity.organizationId,c.req.param("id"));if(!row)return c.json({error:{code:"NOT_FOUND",message:"Task not found"}},404);return c.json({data:row});});

api.post("/conversations",async c=>{const identity=c.get("identity") as {organizationId:string};const body=await c.req.json<{title?:string}>();const id=await new Db(c.env).createConversation(identity.organizationId,body.title??"New conversation");return c.json({id},201);});
api.get("/conversations/:id/messages",async c=>{const identity=c.get("identity") as {organizationId:string};const rows=await new Db(c.env).recentMessages(identity.organizationId,c.req.param("id"));return c.json({data:rows.results});});
api.post("/conversations/:id/messages",async c=>{const identity=c.get("identity") as {organizationId:string};const body=await c.req.json<{role?:string;content?:string}>();if(!body.content)return c.json({error:{code:"VALIDATION_ERROR",message:"content is required"}},400);const id=await new Db(c.env).addMessage(identity.organizationId,c.req.param("id"),body.role??"user",body.content);return c.json({id},201);});

api.get("/memory",async c=>{const identity=c.get("identity");const rows=await new Db(c.env).listMemories(identity.organizationId,identity.userId);return c.json({data:rows.results});});
api.post("/memory",async c=>{const identity=c.get("identity") as {organizationId:string;userId?:string};const body=await c.req.json<{content?:string;type?:string;importance?:number;expiresAt?:string}>();if(!body.content)return c.json({error:{code:"VALIDATION_ERROR",message:"content is required"}},400);const id=await new Db(c.env).createMemory(identity.organizationId,identity.userId,body.type??"fact",body.content,body.importance??0.5,body.expiresAt);return c.json({id},201);});
api.delete("/memory/:id",async c=>{const identity=c.get("identity") as {organizationId:string};await new Db(c.env).deleteMemory(identity.organizationId,c.req.param("id"));return c.body(null,204);});
