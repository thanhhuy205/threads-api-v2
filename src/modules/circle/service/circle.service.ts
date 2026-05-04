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


    async createCircle(data: any) {        // Implement logic to create a new circle using the data provided
        // This is a placeholder implementation and should be replaced with actual logic
        const newCircle = {
            id: Date.now(), // Example ID generation, replace with actual logic
            name: data.name,
            description: data.description,
        };
        // Here you would typically save the new circle to the database
        return newCircle; // Return the created circle
    }
}

export const circleService = new CircleService();