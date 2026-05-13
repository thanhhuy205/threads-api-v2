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
}

export const circleEnergyRepository = new CircleEnergyRepository();
