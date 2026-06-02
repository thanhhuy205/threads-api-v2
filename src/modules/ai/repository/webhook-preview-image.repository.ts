import prisma from "@/config/prisma";
import type { Prisma } from "@prisma/client";

export type SaveWebhookPreviewImageInput = {
  generationId: string;
  content: string;
  userId: string;
  metadata?: Prisma.InputJsonValue;
};

class WebhookPreviewImageRepository {
  savePreviewImage(input: SaveWebhookPreviewImageInput) {
    const webHookPreviewImage = prisma.webHookPreviewImage as any;

    return webHookPreviewImage.upsert({
      where: {
        generationId: input.generationId,
      },
      create: {
        generationId: input.generationId,
        content: input.content,
        userId: input.userId,
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      },
      update: {
        content: input.content,
        userId: input.userId,
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      },
    });
  }

  async updateMetadataByGenerationId(generationId: string, metadata: Prisma.InputJsonValue) {
    const webHookPreviewImage = prisma.webHookPreviewImage;

    const result = await webHookPreviewImage.updateMany({
      where: {
        generationId,
      },
      data: {
        metadata,
      },
    });

    return result.count;
  }
}

export const webhookPreviewImageRepository = new WebhookPreviewImageRepository();
