import { circleMemberRepository } from '../repository/circle-member.repository';
import { circleRepository } from '../repository/circle.repostiroy';

class CircleService {
    async getCircle() {
        const circles = await circleRepository.findAll();
        const members = await circleMemberRepository.findAll();

        return {
            circles,
            members,
        };
    }
}

export const circleService = new CircleService();