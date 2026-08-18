import { Schema } from "ai";

export interface LlmProvider {
    generateStructured<T>(
        prompt: string,
        schema: Schema<T>,
    ): Promise<T>;

    classifyTopics(
        content: string,
    ): Promise<string[]>;
}

export const LLM_PROVIDER = Symbol("LLM_PROVIDER");