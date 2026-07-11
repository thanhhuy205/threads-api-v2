import z from "zod";

export const notionConfig = z.object({
    NOTION_TOKEN: z.string().nonempty("Notion token is required"),
    ANALYTICS_TOKEN: z.string().nonempty("Analytics database ID is required"),
})