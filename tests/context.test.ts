import {describe,expect,it} from "vitest";
import {assembleContext} from "../src/context/types";
describe("context assembly",()=>{it("keeps highest relevance items within budget",()=>{const result=assembleContext({query:"x",maxItems:2,items:[{id:"a",type:"memory",content:"a",relevance:.2},{id:"b",type:"memory",content:"b",relevance:.9},{id:"c",type:"memory",content:"c",relevance:.5}]});expect(result.map(x=>x.id)).toEqual(["b","c"]);});});
