import {
  POST_SCORING_SYSTEM_PROMPT,
  REPORT_EVALUATION_SYSTEM_PROMPT,
} from "@/modules/ai/promt/system.promt";
import { openrouter } from "@/providers/openrouter.provider";
import { ReportTargetType } from "@prisma/client";
class AiService {
  async moderateContent(content: string) {
    // TODO: AI Content Moderation - detect toxic/spam, put in admin queue or auto hide
    return { isSafe: true, confidence: 0.99 };
  }

  async generateCaption(imageUrl: string) {
    // TODO: AI Caption Generator - suggest 3 captions + hashtags
    return { captions: [], hashtags: [] };
  }

  async generateSmartReply(context: string) {
    // TODO: AI Smart Reply in chat - suggest 3 quick replies
    return { replies: [] };
  }

  async recommendContent(userId: string) {
    // TODO: AI Friend/Content Recommendation based on interests & interactions
    return { friends: [], posts: [] };
  }

  async scorePostAI(content: string) {
    const response = await openrouter.chat.send({
      chatRequest: {
        models: [
          "openai/gpt-oss-120b:free",
          "qwen/qwen3-235b-a22b:free",
          "deepseek/deepseek-chat-v3-0324:free",
        ],

        messages: [
          {
            role: "system",
            content: POST_SCORING_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `
            Evaluate this content:

            ${content}
            `,
          },
        ],

        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "post_scoring_result",
            strict: true,
            schema: {
              type: "object",
              properties: {
                score: {
                  type: "number",
                  minimum: 0,
                  maximum: 10,
                },
                label: {
                  type: "string",
                  enum: [
                    "Masterpiece",
                    "Deep Talk",
                    "Solid",
                    "Neutral",
                    "Noise",
                    "Toxic",
                  ],
                },
                reason: {
                  type: "string",
                },
                confidence: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                },
                isToxic: {
                  type: "boolean",
                },
                isSpam: {
                  type: "boolean",
                },
              },
              required: [
                "score",
                "label",
                "reason",
                "confidence",
                "isToxic",
                "isSpam",
              ],
              additionalProperties: false,
            },
          },
        },

        stream: false,
        temperature: 0.2,
      },
    });

    const rawContent = response.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error("AI scoring response is empty");
    }

    const parsed = JSON.parse(rawContent) as {
      score: number;
      label: string;
      reason: string;
      confidence: number;
      isToxic: boolean;
      isSpam: boolean;
    };


    return parsed
  }

  async evaluateReportAI(input: {
    content: string;
    reason: string;
    targetType: ReportTargetType;
  }) {
    const response = await openrouter.chat.send({
      chatRequest: {
        models: [
          "openai/gpt-oss-120b:free",
          "qwen/qwen3-235b-a22b:free",
          "deepseek/deepseek-chat-v3-0324:free",
        ],
        messages: [
          {
            role: "system",
            content: REPORT_EVALUATION_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `
            Evaluate report credibility.

            Target type: ${input.targetType}
            Report reason: ${input.reason}
            Target content:
            ${input.content}
`,
          },
        ],
        responseFormat: {
          type: "json_schema",
          jsonSchema: {
            name: "report_evaluation_result",
            strict: true,
            schema: {
              type: "object",
              properties: {
                assistantNote: {
                  type: "string",
                },
                confidence: {
                  type: "number",
                  minimum: 0,
                  maximum: 1,
                },
              },
              required: ["assistantNote", "confidence"],
              additionalProperties: false,
            },
          },
        },
        stream: false,
        temperature: 0.1,
      },
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error("AI report evaluation response is empty");
    }

    const parsed = JSON.parse(rawContent) as {
      assistantNote: string;
      confidence: number;
    };

    return parsed;
  }
}

export const aiService = new AiService();
