export type PostScoreLabel =
    | "Masterpiece"
    | "Deep Talk"
    | "Solid"
    | "Neutral"
    | "Noise"
    | "Toxic";

export type AiPostScoreResult = {
    score: number;
    reason: string;
    confidence: number;
    isToxic: boolean;
    isSpam: boolean;
};

export type PostReward = {
    score: number;
    label: PostScoreLabel;
    hpDelta: number;
    expDelta: number;
    reason: string;
    confidence: number;
    isToxic: boolean;
    isSpam: boolean;
};

type RewardRule = {
    minScore: number;
    label: PostScoreLabel;
    hpDelta: number;
    expDelta: number;
};

const SCORE_REWARD_RULES: RewardRule[] = [
    {
        minScore: 9,
        label: "Masterpiece",
        hpDelta: 5,
        expDelta: 10,
    },
    {
        minScore: 7,
        label: "Deep Talk",
        hpDelta: 3,
        expDelta: 6,
    },
    {
        minScore: 5,
        label: "Solid",
        hpDelta: 1,
        expDelta: 2,
    },
    {
        minScore: 3,
        label: "Neutral",
        hpDelta: 0,
        expDelta: 0,
    },
    {
        minScore: 1,
        label: "Noise",
        hpDelta: -1,
        expDelta: 0,
    },
    {
        minScore: 0,
        label: "Toxic",
        hpDelta: -3,
        expDelta: 0,
    },
];

export function normalizeScore(score: number): number {
    if (!Number.isFinite(score)) return 3;

    return Math.max(0, Math.min(10, Math.round(score)));
}

export function normalizeConfidence(confidence: number): number {
    if (!Number.isFinite(confidence)) return 0;

    return Math.max(0, Math.min(1, confidence));
}

function findRewardRule(score: number): RewardRule {
    return (
        SCORE_REWARD_RULES.find((rule) => score >= rule.minScore) ??
        SCORE_REWARD_RULES[SCORE_REWARD_RULES.length - 1]
    );
}

export function mapScoreToReward(aiResult: AiPostScoreResult): PostReward {
    let score = normalizeScore(aiResult.score);

    /**
     * Spam / Toxic override:
     * - Toxic chắc chắn score 0
     * - Spam cũng theo rule score 0 của bạn:
     *   "Spam, copypaste không chỉnh sửa, emoji đơn lẻ, quảng cáo trắng trợn..."
     */
    if (aiResult.isToxic || aiResult.isSpam) {
        score = 0;
    }

    const rule = findRewardRule(score);

    return {
        score,
        label: rule.label,
        hpDelta: rule.hpDelta,
        expDelta: rule.expDelta,
        reason: aiResult.reason,
        confidence: normalizeConfidence(aiResult.confidence),
        isToxic: aiResult.isToxic,
        isSpam: aiResult.isSpam,
    };
}