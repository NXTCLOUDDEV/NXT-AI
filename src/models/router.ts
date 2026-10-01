import type {Env} from "../env";import {AnthropicProvider,OpenAIProvider,WorkersAIProvider,ModelRouter} from "./providers";
export function createModelRouter(env:Env){return new ModelRouter(new Map([["workers-ai",new WorkersAIProvider(env)],["openai",new OpenAIProvider(env)],["anthropic",new AnthropicProvider(env)]]));}
