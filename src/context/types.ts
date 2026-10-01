export interface ContextItem {id:string;type:"system"|"conversation"|"memory"|"task"|"tool"|"file";content:string;relevance:number;source?:string;}
export interface ContextRequest {query:string;items:ContextItem[];maxItems:number;}
export function assembleContext(request:ContextRequest):ContextItem[]{return [...request.items].sort((a,b)=>b.relevance-a.relevance).slice(0,request.maxItems);}
