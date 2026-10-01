export interface ToolContext{requestId:string;organizationId?:string;userId?:string;permissions:ReadonlySet<string>;}
export interface ToolDefinition<TInput=unknown,TOutput=unknown>{id:string;name:string;description:string;version:string;inputSchema:unknown;permissions:string[];execute(input:TInput,context:ToolContext):Promise<TOutput>;}
export class ToolRegistry{
 private readonly tools=new Map<string,ToolDefinition>();
 register(tool:ToolDefinition){if(this.tools.has(tool.id))throw new Error(`Tool already registered: ${tool.id}`);this.tools.set(tool.id,tool);return this;}
 get(id:string){return this.tools.get(id);}
 list(){return [...this.tools.values()];}
 async invoke(id:string,input:unknown,context:ToolContext){const tool=this.tools.get(id);if(!tool)throw new Error("Tool not found");for(const permission of tool.permissions)if(!context.permissions.has(permission))throw new Error("Tool permission denied");return tool.execute(input,context);}
}
