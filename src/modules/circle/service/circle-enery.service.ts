import { circleEnergyRepository } from "@/modules/circle/repository/circle-energy.repository";

class CircleEnergyService {
    async decreaseEnergy(ids: number[]) {
        await circleEnergyRepository.decreaseEnergy(ids);
    }
}

export const circleEnergyService = new CircleEnergyService();