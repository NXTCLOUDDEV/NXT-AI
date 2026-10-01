import type {ModelProvider} from "../models/types";
import type {ToolRegistry} from "../tools/types";
export interface AgentRuntimeDeps {model:ModelProvider;tools:ToolRegistry;}
export interface AgentRunInput {request:string;requestId:string;}
export interface AgentRunResult {text:string;verified:boolean;steps:number;}
export class AgentRuntime {constructor(private readonly deps:AgentRuntimeDeps){}
 async run(input:AgentRunInput):Promise<AgentRunResult>{const response=await this.deps.model.generate({messages:[{role:"user",content:input.request}]});return {text:response.text,verified:false,steps:1};}}
