import {Hono} from "hono";
import {routeAgentRequest} from "agents";
import type {Env} from "./env";
import {errorResponse} from "./core/errors";
import {api} from "./api";
import {frontend} from "./frontend";

const app=new Hono<{Bindings:Env}>();
app.use("*",async(c,next)=>{c.header("x-request-id",c.req.header("x-request-id")??crypto.randomUUID());await next();});
app.get("/",c=>new Response(frontend,{headers:{"content-type":"text/html;charset=UTF-8","x-request-id":c.req.header("x-request-id")??"unknown"}}));
app.get("/health",c=>c.json({ok:true,service:"nxt-ai",environment:c.env.ENVIRONMENT??"development"}));
app.get("/api/v1/health",c=>c.json({ok:true,service:"nxt-ai",version:"v1"}));
app.route("/api/v1",api);
app.notFound(c=>errorResponse(new Error("Not found"),c.req.header("x-request-id")??"unknown"));
app.onError((e,c)=>errorResponse(e,c.req.header("x-request-id")??"unknown"));

export default {fetch(request:Request,env:Env,ctx:ExecutionContext){return routeAgentRequest(request,env) ?? app.fetch(request,env,ctx);}};
