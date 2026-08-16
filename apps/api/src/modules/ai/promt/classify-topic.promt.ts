export const promptClassifyTopicFirst = (content: string) => `
Classify the following internal IT discussion into the most relevant high-level categories.

Rules:
- Choose based on the actual meaning of the discussion, not isolated keywords.
- Prefer the smallest number of categories that fully represent the discussion.
- Do not infer unrelated categories.

Discussion:
${content}
`;


export const builderPromptSecond = ({
    content,
    categories,
    allowedTopics,
}: {
    content: string;
    categories: string[];
    allowedTopics: string[];
}) => {
    return `
You are a fine-grained IT topic classifier.

Discussion:
${content}

Selected categories:
${JSON.stringify(categories)}

Allowed topics:
${JSON.stringify(allowedTopics)}

Rules:
- Select 1 to 5 topics.
- Only select from allowedTopics.
- Never invent topics.
- Return JSON only.

Output:
{
  "topics": []
}
`;
}