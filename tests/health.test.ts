import {describe,expect,it} from "vitest";
import worker from "../src/index";
describe("health",()=>{it("returns healthy service response",async()=>{const r=await worker.fetch(new Request("https://example.com/health"),{ENVIRONMENT:"test"} as never,{} as never);expect(r.status).toBe(200);expect(await r.json()).toEqual({ok:true,service:"nxt-ai",environment:"test"});expect(r.headers.get("x-request-id")).toBeTruthy();});});
