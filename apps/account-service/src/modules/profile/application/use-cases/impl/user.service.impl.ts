import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { redisKey } from '@purse/common/constants';
import { RedisService } from '@purse/core/redis';
import { Prisma } from '../../../../../generated/prisma/client';
import type {
  MeCommand,
  OnboardingCommand,
  UpdateProfileCommand,
} from '../../commands';
import { USER_REPOSITORY, type UserRepository } from '../../ports/inbound/user.repository';
import type {
  CurrentUserProfile,
} from '../../result';
import type { UserService } from '../user.service';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) { }

  async updateProfile({ identity, ...payload }: UpdateProfileCommand) {
    const data: Prisma.UserUpdateInput = {};

    if (payload.name !== undefined) {
      data.name = payload.name;
    }

    if (payload.bio !== undefined) {
      data.bio = payload.bio;
    }

    if (payload.labelWebsite !== undefined) {
      data.labelWebsite = payload.labelWebsite;
    }

    if (payload.website !== undefined) {
      data.website = payload.website;
    }

    if (payload.companyName !== undefined) {
      data.companyName = payload.companyName;
    }

    if (payload.companySize !== undefined) {
      data.companySize = payload.companySize;
    }

    const user = await this.userRepository.updateProfile(identity, data);
    await this.redisService.redis.del(redisKey.auth.me(identity));

    return {
      name: user.name,
      bio: user.bio,
      labelWebsite: user.labelWebsite,
      website: user.website,
      companyName: user.companyName,
      companySize: user.companySize,
    };
  }

  async onboarding({ identity, name, bio, location, avatar, companyName, companySize }: OnboardingCommand) {
    const data: Prisma.UserUpdateInput = {
      name,
      bio,
      location,
      ...(avatar !== undefined && { avatar }),
      ...(companyName !== undefined && { companyName }),
      ...(companySize !== undefined && { companySize }),
    };
    const user = await this.userRepository.create(identity, data);
    await this.redisService.redis.del(redisKey.auth.me(identity));

    return {
      name: user.name,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar,
      companyName: user.companyName,
      companySize: user.companySize,
    };
  }

  async me({ identity }: MeCommand): Promise<CurrentUserProfile | null> {
    const cacheKey = redisKey.auth.me(identity);
    const cached = await this.redisService.redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached) as CurrentUserProfile;
      } catch {
        // Ignore malformed cache and rebuild from the database.
      }
    }

    const user = await this.userRepository.findById(identity);
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.redisService.redis.set(cacheKey, JSON.stringify(user), { EX: 30 });

    return {
      id: user.id,
      identity: user.identity,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      location: user.location,
      website: user.website,
      labelWebsite: user.labelWebsite,
      companyName: user.companyName,
      companySize: user.companySize,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getMyStatusProfile(userId: string) {
    const user = await this.userRepository.findStatusProfileById(userId);

    if (!user) {
      return null;
    }

    return {
      isSuccessBio: user.bio !== null,
      isSuccessAvatar: user.avatar !== null && user.avatar !== "",
    };
  }

  async findByUserId(userId: string) {
    return this.userRepository.findById(userId);
  }

  async findExistingIds(userIds: string[]) {
    return this.userRepository.findExistingIds(userIds);
  }
}

