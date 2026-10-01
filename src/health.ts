import type {Env} from "./env";
export function healthResponse(env:Env,requestId:string){return Response.json({ok:true,service:"nxt-ai",environment:env.ENVIRONMENT??"development"},{headers:{"x-request-id":requestId}});}
