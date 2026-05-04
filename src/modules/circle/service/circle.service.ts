import { CreateCircleInput } from '@/modules/circle/interfaces/circle-service.interface';
import { SendInvitationInput } from '@/modules/circle/interfaces/send-invitation.interface';
import { RoleMembership } from '@prisma/client';
import { circleMemberRepository } from '../repository/circle-member.repository';
import { circleRepository } from '../repository/circle.repository';

class CircleService {
    async getCircle() {
        const circles = await circleRepository.findAll({ page: 1, limit: 10 });
        const members = await circleMemberRepository.findAll({ page: 1, limit: 10 });

        return {
            circles,
            members,
        };
    }


    async createCircle(data: CreateCircleInput) {
        const newCircle = await circleRepository.create({
            name: data.name,
            visibility: data.visibility,
            createById: data.createById,
            userId: data.userId,
        });

        return newCircle;
    }

    async sendInvitation(data: SendInvitationInput) {
        const circle = await circleMemberRepository.findByCircleId(data.circleId, data.userId);
        if (circle.length > 0) {
            throw new Error(`User ${data.userId} is already a member of circle ${data.circleId}`);
        }

        const userRole = await circleMemberRepository.findRoleByCircleId(data.circleId, data.inviterId);
        if (userRole && (userRole.role === RoleMembership.ADMIN || userRole.role === RoleMembership.OWNER)) {
           
        } else {
            throw new Error(`User ${data.inviterId} is not an admin or owner of circle ${data.circleId}`);
        }

    }
}
export const circleService = new CircleService();