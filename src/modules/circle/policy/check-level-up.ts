export type CircleLevel = 1 | 2 | 3 | 4 | 5;

export type CircleLevelConfig = {
    level: CircleLevel;
    name: string;
    requiredExp: number;
    maxHp: number;
    drainPerHour: number;
};

export function isCircleLevel(value: number): value is CircleLevel {
    return value >= 1 && value <= 5;
}

export function toCircleLevel(value: number): CircleLevel {
    if (!isCircleLevel(value)) {
        throw new Error(`Invalid circle level: ${value}`);
    }

    return value;
}
export const CIRCLE_LEVEL_CONFIG: Record<CircleLevel, CircleLevelConfig> = {
    1: {
        level: 1,
        name: "Newborn",
        requiredExp: 0,
        maxHp: 500,
        drainPerHour: 10,
    },
    2: {
        level: 2,
        name: "Growing",
        requiredExp: 200,
        maxHp: 650,
        drainPerHour: 9,
    },
    3: {
        level: 3,
        name: "Thriving",
        requiredExp: 500,
        maxHp: 800,
        drainPerHour: 8,
    },
    4: {
        level: 4,
        name: "Veteran",
        requiredExp: 1000,
        maxHp: 950,
        drainPerHour: 7,
    },
    5: {
        level: 5,
        name: "Legend",
        requiredExp: 2000,
        maxHp: 1000,
        drainPerHour: 6,
    },
};