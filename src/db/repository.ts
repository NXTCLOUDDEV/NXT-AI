import type {Env} from "../env";
import {id,now} from "../core/types";
export class Db {constructor(private readonly env:Env){}
 async createOrganization(name:string){const orgId=id("org");await this.env.DB.prepare("INSERT INTO organizations(id,name,created_at,updated_at) VALUES(?,?,?,?)").bind(orgId,name,now(),now()).run();return orgId;}
 async createConversation(orgId:string,title:string){const conversationId=id("conv");await this.env.DB.prepare("INSERT INTO conversations(id,organization_id,title,created_at,updated_at) VALUES(?,?,?,?,?)").bind(conversationId,orgId,title,now(),now()).run();return conversationId;}
 async addMessage(orgId:string,conversationId:string,role:string,content:string){const messageId=id("msg");await this.env.DB.prepare("INSERT INTO messages(id,organization_id,conversation_id,role,content,created_at) VALUES(?,?,?,?,?,?)").bind(messageId,orgId,conversationId,role,content,now()).run();return messageId;}
 async recentMessages(orgId:string,conversationId:string,limit=30){return this.env.DB.prepare("SELECT id,role,content,created_at FROM messages WHERE organization_id=? AND conversation_id=? ORDER BY created_at DESC LIMIT ?").bind(orgId,conversationId,limit).all();}
 async createTask(orgId:string,input:string){const taskId=id("task");const t=now();await this.env.DB.prepare("INSERT INTO tasks(id,organization_id,status,input,created_at,updated_at) VALUES(?,?,?,?,?,?)").bind(taskId,orgId,"queued",input,t,t).run();return taskId;}
 async setTaskStatus(taskId:string,status:string,error?:string){await this.env.DB.prepare("UPDATE tasks SET status=?,error=?,updated_at=? WHERE id=?").bind(status,error??null,now(),taskId).run();}
 async addAudit(orgId:string,action:string,resourceType:string,resourceId:string,metadata:unknown){await this.env.DB.prepare("INSERT INTO audit_logs(id,organization_id,action,resource_type,resource_id,metadata_json) VALUES(?,?,?,?,?,?)").bind(id("audit"),orgId,action,resourceType,resourceId,JSON.stringify(metadata)).run();}
}
