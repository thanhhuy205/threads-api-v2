import z from "zod";

export const classificationSchema = z.object({
    topics: z.array(z.string()),
});

export const responseFormat = {
    type: "json_schema",
    json_schema: {
        name: "topic_categories",
        strict: true,
        schema: {
            type: "object",
            properties: {
                categories: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: [
                            "software-engineering",
                            "backend",
                            "frontend",
                            "mobile",
                            "api-integration",
                            "authentication-authorization",
                            "database",
                            "messaging-event-processing",
                            "devops",
                            "cloud",
                            "infrastructure",
                            "networking",
                            "security",
                            "testing-qa",
                            "observability-reliability",
                            "ai-ml",
                            "data-engineering",
                            "ui-ux",
                            "payments",
                            "search",
                            "real-time-systems",
                            "git-source-control",
                            "engineering-process",
                        ],
                    },
                    minItems: 1,
                    maxItems: 3,
                },
            },
            required: ["categories"],
            additionalProperties: false,
        },
    },
} as const;