import prisma from "@/config/prisma";
import { Prisma } from "@prisma/client";

type CreateCircleEnergyInput = {
  circleId: number;
  current?: number;
  max?: number;
  peak?: number;
};

class CircleEnergyRepository {
  async create(
    data: CreateCircleEnergyInput,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleEnergy.create({
      data: {
        circleId: data.circleId,
        current: data.current,
        max: data.max,
        peak: data.peak,
      },
    });
  }

  async decreaseEnergy(ids: number[]) {
    return await prisma.$executeRaw`
     UPDATE circle_energy
     SET current = GREATEST(
      0,
      current - CASE
        WHEN level <= 1 THEN 10
        WHEN level = 2 THEN 9
        WHEN level = 3 THEN 8
        WHEN level = 4 THEN 7
        WHEN level = 5 THEN 6
      END
    )
    WHERE circle_id IN (${Prisma.join(ids)})
    `
  }

  async findByCircleId(
    circleId: number,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleEnergy.findFirst({
      where: { circleId },
    });
  }

  async updateEnergy(
    circleId: number,
    exp: number,
    hp: number,
    tx: Prisma.TransactionClient = prisma,
  ) {
    return tx.circleEnergy.updateMany({
      where: { circleId },
      data: {
        exp,
        current: hp,
      },
    });
  }

  upLevel(
    circleId: number,
    exp: number,
    hp: number,
    tx: Prisma.TransactionClient = prisma,
    levelUpOnly = false,
  ) {
    return tx.circleEnergy.updateMany({
      where: { circleId },
      data: {
        exp,
        current: levelUpOnly ? undefined : hp,
        max: levelUpOnly ? undefined : hp,
        level: {
          increment: 1,
        },
      },
    });
  }
}

export const circleEnergyRepository = new CircleEnergyRepository();
