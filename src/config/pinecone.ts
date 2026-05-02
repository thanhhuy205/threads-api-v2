import z from "zod";

export const pineconeConfig = z.object({
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_INDEX_NAME: z.string().min(1),
});