import {describe,expect,it} from "vitest";
import {healthResponse} from "../src/health";
describe("health",()=>{it("returns healthy service response",async()=>{const r=healthResponse({ENVIRONMENT:"test"} as never,"req-test");expect(r.status).toBe(200);expect(await r.json()).toEqual({ok:true,service:"nxt-ai",environment:"test"});expect(r.headers.get("x-request-id")).toBe("req-test");});});
