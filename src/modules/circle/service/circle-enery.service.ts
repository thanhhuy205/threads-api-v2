import { circleEnergyRepository } from "@/modules/circle/repository/circle-energy.repository";
import { Prisma } from "@prisma/client";

class CircleEnergyService {
  async decreaseEnergy(ids: number[]) {
    await circleEnergyRepository.decreaseEnergy(ids);
  }

  findByCircleId(circleId: number, tx?: Prisma.TransactionClient) {
    return circleEnergyRepository.findByCircleId(
      circleId,
      tx as Prisma.TransactionClient,
    );
  }

  create(
    data: {
      circleId: number;
      current?: number;
      max?: number;
      peak?: number;
    },
    tx?: Prisma.TransactionClient,
  ) {
    return circleEnergyRepository.create(data, tx as Prisma.TransactionClient);
  }

  async getOrCreateCircleEnergy(circleId: number, tx?: Prisma.TransactionClient) {
    let energy = await this.findByCircleId(circleId, tx);
    if (!energy) {
      energy = await this.create(
        {
          circleId,
          current: 500,
          max: 500,
          peak: 500,
        },
        tx,
      );
    }

    return energy;
  }

  async addExpAndHp(
    circleId: number,
    exp: number,
    hp: number,
    tx?: Prisma.TransactionClient,
  ) {
    const energy = await this.getOrCreateCircleEnergy(circleId, tx);
    const newExp = energy.exp + exp;
    const newHp = energy.current + hp;
    await circleEnergyRepository.updateEnergy(circleId, newExp, newHp, tx);
    return { newExp, newHp };
  }
}

export const circleEnergyService = new CircleEnergyService();
