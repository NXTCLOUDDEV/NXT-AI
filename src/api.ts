import {Hono} from "hono";import type {Env} from "./env";import {Db} from "./db/repository";import {TaskService} from "./tasks/service";
export const api=new Hono<{Bindings:Env}>();
api.post("/tasks",async c=>{const body=await c.req.json<{organizationId?:string;input?:string}>();if(typeof body.input!=="string"||body.input.trim().length===0)return c.json({error:{code:"VALIDATION_ERROR",message:"input is required"}},400);const org=body.organizationId??"default";const taskId=await new TaskService(c.env).create(org,body.input.trim());return c.json({id:taskId,status:"queued"},202);});
api.get("/conversations/:id/messages",async c=>{const org=c.req.header("x-organization-id")??"default";const rows=await new Db(c.env).recentMessages(org,c.req.param("id"));return c.json({data:rows.results});});
