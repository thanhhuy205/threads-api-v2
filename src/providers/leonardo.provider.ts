import configService from "@/config/config";

const API = "https://cloud.leonardo.ai/api/rest/v1";

const headers = {
    Authorization: `Bearer ${configService.LEONARDO_API_KEY}`,
    "Content-Type": "application/json",
};

export type LeonardoGenerateJobOptions = {
    modelId?: string;
    width?: number;
    height?: number;
};

export type LeonardoSdGenerationJob = {
    generationId?: string;
    modelId?: string;
    prompt?: string;
    status?: string;
    [key: string]: unknown;
};

type LeonardoGenerateJobResponse = {
    sdGenerationJob: LeonardoSdGenerationJob;
};

export async function generateJob(prompt: string, options: LeonardoGenerateJobOptions = {}) {
    const response = await fetch(`${API}/generations`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            prompt,
            modelId: options.modelId ?? "1dd50843-d653-4516-a8e3-f0238ee453ff",
            width: options.width ?? 1024,
            height: options.height ?? 1024,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Leonardo generate job failed: ${response.status} ${errorText}`);
    }

    const { sdGenerationJob } = (await response.json()) as LeonardoGenerateJobResponse;

    return sdGenerationJob;
}

export const leonardo = {
    generateJob,
};

export { API, headers };
