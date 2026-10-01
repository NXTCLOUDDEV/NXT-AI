import {describe,expect,it} from "vitest";
import {ToolRegistry} from "../src/tools/types";
describe("tool registry",()=>{it("rejects duplicate ids",()=>{const r=new ToolRegistry();const t={id:"x",name:"x",description:"x",version:"1",inputSchema:{},permissions:[],execute:async()=>null};r.register(t);expect(()=>r.register(t)).toThrow();});});
