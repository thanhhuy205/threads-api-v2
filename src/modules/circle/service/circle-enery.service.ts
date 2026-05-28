import { circleEnergyRepository } from "@/modules/circle/repository/circle-energy.repository";

class CircleEnergyService {
    async decreaseEnergy(ids: number[]) {
        await circleEnergyRepository.decreaseEnergy(ids);
    }

    async addExpAndHp(circleId: number, exp: number, hp: number) {
        let energy = await circleEnergyRepository.findByCircleId(circleId);
        if (!energy) {
            energy = await circleEnergyRepository.create({
                circleId,
                current: 500,
                max: 500,
                peak: 500,
            });
        }
        const newExp = energy.exp + exp;
        const newHp = energy.current + hp;
        await circleEnergyRepository.updateEnergy(circleId, newExp, newHp);
        return { newExp, newHp };
    }
}

export const circleEnergyService = new CircleEnergyService();