import { TOPICS_BY_CATEGORY } from "@api/modules/ai/constants/categories";
export type TopicCategory = keyof typeof TOPICS_BY_CATEGORY;


export const getTopicsByCategory = (category: string[]) => {
    const setCategory = [...new Set(category)];

    const topics = setCategory.flatMap((cat) => {
        if (!(cat in TOPICS_BY_CATEGORY)) {
            return [];
        }
        return TOPICS_BY_CATEGORY[cat as TopicCategory];
    });

    return topics;
}