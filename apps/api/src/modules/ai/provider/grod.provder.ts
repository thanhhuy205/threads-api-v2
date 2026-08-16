import { builderPromptSecond, promptClassifyTopicFirst } from "@api/modules/ai/promt/classify-topic.promt";
import { LlmProvider } from "@api/modules/ai/provider/llm-provider.interface";
import { responseFormat } from "@api/modules/ai/schemas/classify-topic.schema";
import { getTopicsByCategory } from "@api/modules/ai/workflows/discussion-summary.workflow";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Schema } from "ai";
import { Groq } from "groq-sdk/client";

@Injectable()
export class GroqProvider implements LlmProvider {
    private groqClient: Groq;
    constructor(configService: ConfigService) {
        this.groqClient = new Groq({ apiKey: configService.get<string>("GROQ_CONFIG.GROQ_API_KEY") });
    }
    async classifyTopics(content: string): Promise<string[]> {
        const results = await this.groqClient.chat.completions.create({
            model: "groq-1.0",
            messages: [
                {
                    role: "user",
                    content: promptClassifyTopicFirst(content)
                }
            ],
            max_tokens: 100,
            response_format: responseFormat,
            temperature: 0.5,
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

        const topics = await this.groqClient.chat.completions.create({
            model: "groq-1.0",
            messages: [
                {
                    role: "user",
                    content: builderPromptSecond(
                        {
                            content,
                            categories,
                            allowedTopics: getTopicsByCategory(categories),
                        }
                    ),
                }
            ],
            max_tokens: 100,
            response_format: responseFormat,
            temperature: 0.5,
        });
        return topics.choices[0].message?.content ? JSON.parse(topics.choices[0].message.content).categories : [];
    }

    generateStructured<T>(prompt: string, schema: Schema<T>): Promise<T> {
        throw new Error("Method not implemented.");
    }
}