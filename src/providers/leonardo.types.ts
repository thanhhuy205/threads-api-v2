export type LeonardoEventType =
  | "image_generation.complete"
  | "image_generation.failed"
  | "video_generation.complete"
  | "video_generation.failed"
  | "upscale.complete";

export type LeonardoGenerationStatus = "PENDING" | "COMPLETE" | "FAILED";
export type LeonardoCoreModel = "FLUX" | "SDXL_LIGHTNING" | "PHOENIX" | "SD_1_5" | string;
export type LeonardoSdVersion = "FLUX" | "SDXL_1_0" | "v3" | string;

export interface LeonardoGeneratedImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  url: string;
  generationId: string;
  nobgId: string | null;
  nsfw: boolean;
  likeCount: number;
  trendingScore: number;
  public: boolean;
  motionGIFURL: string | null;
  motionMP4URL: string | null;
  teamId: string | null;
  image_height: number;
  image_width: number;
  threeDUrl: string | null;
}

export interface LeonardoModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  public: boolean;
  userId: string;
  flagged: boolean;
  nsfw: boolean;
  official: boolean;
  status: LeonardoGenerationStatus;
  coreModel: LeonardoCoreModel;
  sdVersion: LeonardoSdVersion;
  modelHeight: number;
  modelWidth: number;
  type: string;
  featured: boolean;
  api: boolean;
  apiVersions: string[];
  [key: string]: unknown;
}

export interface LeonardoGenerationObject {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  public: boolean;
  flagged: boolean;
  nsfw: boolean;
  status: LeonardoGenerationStatus;
  coreModel: LeonardoCoreModel;
  guidanceScale: number;
  imageHeight: number;
  imageWidth: number;
  inferenceSteps: number;
  modelId: string;
  prompt: string;
  negativePrompt: string;
  quantity: number;
  sdVersion: LeonardoSdVersion;
  seed: string;
  scheduler: string;
  presetStyle: string | null;
  promptMagic: boolean;
  apiDollarCost: string;
  api: boolean;
  imageToImage: boolean;
  controlnetsUsed: boolean;
  transparency: "disabled" | "enabled";
  source: "LEONARDO" | string;
  is3d: boolean;
  isStoryboard: boolean;
  tiling: boolean;
  photoReal: boolean;
  highContrast: boolean;
  generation_notes: unknown[];
  model: LeonardoModel;
  images: LeonardoGeneratedImage[];
  teams: unknown[] | null;
  initGeneratedImageId: string | null;
  initImageId: string | null;
  initStrength: number | null;
  initType: string | null;
  initUpscaledImageId: string | null;
  imageAspectRatio: string | null;
  styleUUID: string | null;
  tokenCost: number;
  ultra: boolean | null;
  alchemy: boolean | null;
  [key: string]: unknown;
}

export interface LeonardoWebhookPayload {
  type: LeonardoEventType;
  object: "generation" | "video" | "upscale";
  timestamp: number;
  api_version: "v1" | string;
  data: {
    object: LeonardoGenerationObject;
  };
}

export interface LeonardoGenerationResponse {
  sdGenerationJob: LeonardoGenerationObject;
}

export function isImageGenerationComplete(
  payload: LeonardoWebhookPayload,
): payload is LeonardoWebhookPayload & { type: "image_generation.complete" } {
  return payload.type === "image_generation.complete";
}

export function isImageGenerationFailed(
  payload: LeonardoWebhookPayload,
): payload is LeonardoWebhookPayload & { type: "image_generation.failed" } {
  return payload.type === "image_generation.failed";
}
