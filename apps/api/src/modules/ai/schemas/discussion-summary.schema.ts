import { z } from 'zod';

export const DiscussionSummarySchema = z.object({
    decision: z.string().nullable(),

    reasons: z.array(z.string()),

    unresolvedIssues: z.array(z.string()),

    actionItems: z.array(
        z.object({
            title: z.string(),
            assignee: z.string().nullable(),
        }),
    ),

    hasDecision: z.boolean(),
});


