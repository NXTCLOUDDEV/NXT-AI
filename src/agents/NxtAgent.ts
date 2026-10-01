import {Agent,callable} from "agents";
import type {Env} from "../env";
export interface NxtAgentState {status:"idle"|"running"|"waiting"|"completed"|"failed";taskId?:string;updatedAt:string;}
export class NxtAgent extends Agent<Env,NxtAgentState>{initialState:NxtAgentState={status:"idle",updatedAt:new Date().toISOString()};
  @callable()
  setTask(taskId:string){this.setState({status:"running",taskId,updatedAt:new Date().toISOString()});return this.state;}
  @callable()
  complete(){this.setState({...this.state,status:"completed",updatedAt:new Date().toISOString()});return this.state;}
}