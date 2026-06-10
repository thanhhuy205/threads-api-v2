export type CircleHpTag = "Healthy" | "Sick" | "Dying" | "Dead";

export type CircleHpConfig = {
  tag: CircleHpTag;
  minPercent: number;
};

export const CIRCLE_LEVEL_CONFIG_HP = {
  HEALTHY: { tag: "Healthy", minPercent: 30 },
  SICK: { tag: "Sick", minPercent: 10 },
  DYING: { tag: "Dying", minPercent: 0 },
  DEAD: { tag: "Dead", minPercent: 0 },
} as const satisfies Record<string, CircleHpConfig>;

export function getCircleHpTag(
  currentHp: number,
  maxHp: number = 100,
): CircleHpTag {
  if (currentHp <= 0 || maxHp <= 0) {
    return "Dead";
  }

  const hpPercent = (currentHp / maxHp) * 100;

  if (hpPercent >= CIRCLE_LEVEL_CONFIG_HP.HEALTHY.minPercent) {
    return CIRCLE_LEVEL_CONFIG_HP.HEALTHY.tag;
  }

  if (hpPercent >= CIRCLE_LEVEL_CONFIG_HP.SICK.minPercent) {
    return CIRCLE_LEVEL_CONFIG_HP.SICK.tag;
  }

  return CIRCLE_LEVEL_CONFIG_HP.DYING.tag;
}
