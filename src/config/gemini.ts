import z from "zod";

export const geminiConfig = z.object({
    GEMINI_API_KEY: z.string().nonempty("Gemini API key is required"),
})