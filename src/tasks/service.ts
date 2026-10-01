import type {Env} from "../env";import {Db} from "../db/repository";
export type TaskStatus="queued"|"planning"|"running"|"waiting"|"paused"|"failed"|"completed"|"cancelled";
export class TaskService{constructor(private readonly env:Env){}async create(orgId:string,input:string){const db=new Db(this.env);await db.ensureOrganization(orgId);return db.createTask(orgId,input);}async transition(taskId:string,status:TaskStatus,error?:string){return new Db(this.env).setTaskStatus(taskId,status,error);}}
