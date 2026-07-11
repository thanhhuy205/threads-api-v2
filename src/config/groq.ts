import z from "zod";

export const groQConfig = z.object({
    GROQ_API_KEY: z.string().nonempty("Gemini API key is required"),
})