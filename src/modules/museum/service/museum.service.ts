import type { MuseumQueryDto } from '../dto/request/museum.query.dto';

class MuseumService {
    async getMuseumList(query: MuseumQueryDto) {
        return {
            items: [
                {
                    publicId: 'circle_public_stub_1',
                    summary: 'Mot circle da duoc bao ton trong Museum of Echoes',
                    livedDays: 90,
                    maxLevel: 4,
                    featured: true,
                },
            ],
            nextCursor: query.cursor ? null : 'museum_cursor_stub',
            limit: query.limit ?? 20,
            sort: query.sort ?? 'recent',
        };
    }

    async getMuseumDetail(publicId: string) {
        return {
            publicId,
            summary: 'Circle nay da tung dat energy rat cao truoc khi tro thanh Soul Stone',
            peakHp: 1000,
            livedDays: 120,
            topPostIds: [1001, 1002, 1003],
            maxLevel: 5,
            totalMembers: 88,
            heroes: [
                {
                    userId: 'user_stub_hero_1',
                    badgeType: 'SACRIFICE_HERO',
                },
            ],
        };
    }
}

export const museumService = new MuseumService();
