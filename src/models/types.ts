export type ModelCapability="streaming"|"tool_calling"|"structured_output";
export interface ModelRequest {messages:Array<{role:"system"|"user"|"assistant"|"tool";content:string}>;model?:string;temperature?:number;maxTokens?:number;}
export interface ModelResponse {text:string;model:string;provider:string;usage?:{inputTokens:number;outputTokens:number};}
export interface ModelProvider {id:string;listModels():Promise<string[]>;generate(request:ModelRequest):Promise<ModelResponse>;}
