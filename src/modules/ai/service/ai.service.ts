import { BadRequestException } from "@/errors/error";
import {
  FORMAT_MARKDOWN_PROMPT,
  GENERATE_IMAGE_PROMPT,
  POST_SCORING_SYSTEM_PROMPT,
  REPORT_EVALUATION_SYSTEM_PROMPT
} from "@/modules/ai/promt/system.promt";
import { webhookPreviewImageRepository } from "@/modules/ai/repository/webhook-preview-image.repository";
import { limitActionService } from "@/modules/limit-action/service/limit-action.service";
import { userActionLogService } from "@/modules/user-action-log/service/user-action-log.service";
import { groq } from "@/providers/groq.provider";
import { generateJob } from "@/providers/leonardo.provider";
import type { LeonardoGenerationJob } from "@/providers/leonardo.types";
import { openrouter } from "@/providers/openrouter.provider";
import { ActionType, ReportTargetType } from "@prisma/client";
import { randomUUID } from "node:crypto";

type GenerateImageCaptionInput = {
  content: string;
  userId: string;
};

class AiService {
  async generateCaptionMd(userId: string, content: string) {
    const countGeneration = await userActionLogService.countActionLog(userId, ActionType.GENERATE_CAPTION_MD);

    if (countGeneration >= 3) {
      await limitActionService.createLimitAction({
        userId,
        type: ActionType.GENERATE_CAPTION_MD,
        resetAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // reset sau 5 ngày
      });
      throw new BadRequestException("Generation free for account limit 5 times, please contact support to increase the limit");
    }

    if (!content?.trim()) {
      throw new BadRequestException("Input text is empty");
    }

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: FORMAT_MARKDOWN_PROMPT() },
        { role: "user", content: `Đây là nội dung cần đánh bóng ${content}` },
      ]
    })
    console.log(response)
    const markdown = response.choices[0].message.content;

    if (!markdown) {
      throw new Error("AI markdown response is empty");
    }


    await userActionLogService.logAction({
      userId,
      type: ActionType.GENERATE_CAPTION_MD,
      targetId: randomUUID(),
      metadata: {
        inputLength: content.length,
        outputLength: markdown.length,
      },
    });
    return markdown;
  }

  async generateImageCaption(input: GenerateImageCaptionInput): Promise<LeonardoGenerationJob> {
    const { content, userId } = input;

    const countGeneration = await userActionLogService.countActionLog(userId, ActionType.GENERATE_IMAGE);
    if (countGeneration >= 5) {
      await limitActionService.createLimitAction({
        userId,
        type: ActionType.GENERATE_IMAGE,
        resetAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // reset sau 5 ngày
      });
      throw new BadRequestException("Generation free for account limit 5 times, please contact support to increase the limit");
    }

    if (!content?.trim()) {
      throw new BadRequestException("Input content is empty");
    }
    if (!userId?.trim()) {
      throw new BadRequestException("User ID is empty");
    }
    const MAX_PROMPT = 1450;
    const generatedPrompt = await this.generatePromptForImageGeneration(content);
    const normalizedPrompt = generatedPrompt.trim();

    if (!normalizedPrompt) {
      throw new Error("AI image prompt response is empty");
    }

    const prompt = normalizedPrompt.slice(0, MAX_PROMPT);
    const sdGenerationJob = await generateJob(prompt);
    await userActionLogService.logAction({
      userId,
      type: ActionType.GENERATE_IMAGE,
      targetId: sdGenerationJob.generationId,
      metadata: {
        inputLength: content.length,
      },
    });
    await webhookPreviewImageRepository.savePreviewImage({
      generationId: sdGenerationJob.generationId,
      content: normalizedPrompt,
      userId,
    });

    return sdGenerationJob;
  }

  async scorePostAI(content: string) {
    const response = await openrouter.chat.send({
      chatRequest: {
        models: [
          "openrouter/free"
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

    if (!input.reason?.trim()) {
      throw new BadRequestException("Report reason is empty");
    }

    const response = await openrouter.chat.send({
      chatRequest: {
        models: [
          "openrouter/free"
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
          ${input?.content}
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
                isDisinformation: {
                  type: "boolean",
                },
              },
              required: ["assistantNote", "confidence", "isDisinformation"],
              additionalProperties: false,
            },
          },
        },
        stream: false,
        temperature: 0.1,
      },
    });

    const choice = response.choices?.[0];
    const rawContent = choice?.message?.content;

    if (!rawContent || typeof rawContent !== "string") {
      console.error("[AI_REPORT_EMPTY_RESPONSE]", {
        finishReason: choice?.finishReason,
        choice,
        response,
        input: {
          targetType: input.targetType,
          contentLength: input.content.length,
          reasonLength: input.reason.length,
        },
      });

      throw new Error("AI report evaluation response is empty");
    }

    try {
      return JSON.parse(rawContent) as {
        assistantNote: string;
        confidence: number;
        isDisinformation: boolean;
      };
    } catch (error) {
      console.error("[AI_REPORT_JSON_PARSE_FAILED]", {
        rawContent,
        error,
      });

      throw new Error("AI report evaluation JSON parse failed");
    }
  }

  async generatePromptForImageGeneration(content: string) {
    if (!content?.trim()) {
      throw new BadRequestException("Input content is empty");
    }

    const response = await openrouter.chat.send({
      chatRequest: {
        models: [
          "openrouter/free"
        ],
        messages: [
          {
            role: "system",
            content: GENERATE_IMAGE_PROMPT(content),
          },
        ],
        stream: false,
        temperature: 0.2,
      },
    });

    return response.choices[0]?.message?.content || "";
  }

}

export const aiService = new AiService();
