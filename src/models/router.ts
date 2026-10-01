import type {Env} from "../env";import {AnthropicProvider,OpenAIProvider,ModelRouter} from "./providers";
export function createModelRouter(env:Env){return new ModelRouter(new Map([["openai",new OpenAIProvider(env)],["anthropic",new AnthropicProvider(env)]]));}
