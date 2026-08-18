import { builderPromptSecond, promptClassifyTopicFirst } from "@api/modules/ai/promt/classify-topic.promt";
import { LlmProvider } from "@api/modules/ai/provider/llm-provider.interface";
import { responseFormat, responseTopicsFormat } from "@api/modules/ai/schemas/classify-topic.schema";
import { getTopicsByCategory } from "@api/modules/ai/workflows/discussion-summary.workflow";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Schema } from "ai";
import { Groq } from "groq-sdk/client";

@Injectable()
export class GroqProvider implements LlmProvider {
    private static readonly MODEL = "openai/gpt-oss-20b";
    private static readonly MAX_COMPLETION_TOKENS = 512;
    private groqClient: Groq;

    constructor(configService: ConfigService) {
        this.groqClient = new Groq({ apiKey: configService.get<string>("GROQ_CONFIG.GROQ_API_KEY") });
    }
    async classifyTopics(content: string): Promise<string[]> {
        const results = await this.groqClient.chat.completions.create({
            model: GroqProvider.MODEL,
            messages: [
                {
                    role: "user",
                    content: promptClassifyTopicFirst(content)
                }
            ],
            max_completion_tokens: GroqProvider.MAX_COMPLETION_TOKENS,
            response_format: responseFormat,
            reasoning_effort: "low",
            temperature: 0,
        });
        if (!results.choices || results.choices.length === 0 || !results.choices[0].message || !results.choices[0].message.content) {
            throw new Error("No response from Groq API");
        }
        const firstResult = JSON.parse(
            results.choices[0].message.content ?? '{"categories":[]}',
        ) as {
            categories: string[];
        };
        const categories = firstResult.categories;
        const allowedTopics = getTopicsByCategory(categories);
        const allowedTopicSet = new Set<string>(allowedTopics);

        if (allowedTopics.length === 0) {
            return [];
        }

        const topics = await this.groqClient.chat.completions.create({
            model: GroqProvider.MODEL,
            messages: [
                {
                    role: "user",
                    content: builderPromptSecond(
                        {
                            content,
                            categories,
                            allowedTopics,
                        }
                    ),
                }
            ],
            max_completion_tokens: GroqProvider.MAX_COMPLETION_TOKENS,
            response_format: responseTopicsFormat,
            reasoning_effort: "low",
            temperature: 0,
        });
        const topicsContent = topics.choices[0]?.message?.content;
        if (!topicsContent) {
            throw new Error("No topics response from Groq API");
        }

        const secondResult = JSON.parse(topicsContent) as { topics: string[] };

        return [...new Set(secondResult.topics)]
            .filter((topic) => allowedTopicSet.has(topic))
            .slice(0, 5);
    }

    generateStructured<T>(prompt: string, schema: Schema<T>): Promise<T> {
        throw new Error("Method not implemented.");
    }
}
