import {Hono} from "hono";
import {routeAgentRequest} from "agents";
import type {Env} from "./env";
import {errorResponse} from "./core/errors";
import {api} from "./api";
import {frontend} from "./frontend";
import {processTask} from "./tasks/processor";
import {NxtAgent} from "./agents/NxtAgent";

const app=new Hono<{Bindings:Env}>();
app.use("*",async(c,next)=>{const requestId=c.req.header("x-request-id")??crypto.randomUUID();c.header("x-request-id",requestId);c.header("x-content-type-options","nosniff");c.header("x-frame-options","DENY");c.header("referrer-policy","no-referrer");c.header("permissions-policy","camera=(),microphone=(),geolocation=()");const length=Number(c.req.header("content-length")??0);if(length>2_000_000)return c.json({error:{code:"VALIDATION_ERROR",message:"Request body too large",requestId}},413);await next();});
app.get("/",c=>new Response(frontend,{headers:{"content-type":"text/html;charset=UTF-8","x-request-id":c.req.header("x-request-id")??"unknown"}}));
app.get("/health",c=>c.json({ok:true,service:"nxt-ai",environment:c.env.ENVIRONMENT??"development"}));
app.get("/api/v1/health",c=>c.json({ok:true,service:"nxt-ai",version:"v1"}));
app.route("/api/v1",api);
app.notFound(c=>errorResponse(new Error("Not found"),c.req.header("x-request-id")??"unknown"));
app.onError((e,c)=>errorResponse(e,c.req.header("x-request-id")??"unknown"));

export {NxtAgent};

export default {
  fetch(request:Request,env:Env,ctx:ExecutionContext){return routeAgentRequest(request,env) ?? app.fetch(request,env,ctx);},
  async queue(batch:any,env:Env){for(const message of batch.messages){try{await processTask(env,message.body.taskId);message.ack();}catch(error){console.error("task processing failed",error);message.retry();}}}
};
