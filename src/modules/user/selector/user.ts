import { Prisma } from '@prisma/client';

export const userCompactSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
    name: true,
    avatar: true,
    verifiedAt: true,
    isPrivate: true
});

export const userFollowSelect = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    username: true,
    name: true,
    verifiedAt: true
});

export const userProfileSelect = Prisma.validator<Prisma.UserSelect>()({
    ...userCompactSelect,
    bio: true,
    followersCount: true,
    followingCount: true,
    postsCount: true,
    location: true,
    website: true
});

export const userOwnerSelect = Prisma.validator<Prisma.UserSelect>()({
    ...userProfileSelect,
    email: true,
    status: true,
    createdAt: true,
    updatedAt: true
});

export const followRecordSelect = Prisma.validator<Prisma.FollowSelect>()({
    id: true,
    userId: true,
    followingId: true,
    status: true,
    createdAt: true,
    updatedAt: true
});

export const followFollowersSelect = Prisma.validator<Prisma.FollowSelect>()({
    user: {
        select: userFollowSelect
    }
});

export const followFollowingSelect = Prisma.validator<Prisma.FollowSelect>()({
    following: {
        select: userFollowSelect
    }
});