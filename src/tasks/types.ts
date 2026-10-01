export type TaskStatus="queued"|"planning"|"running"|"waiting"|"paused"|"failed"|"completed"|"cancelled";
export interface Task {id:string;organizationId?:string;status:TaskStatus;plan?:unknown;result?:unknown;error?:string;createdAt:string;updatedAt:string;}
