import { redisKey } from "@/constants/resolve-key/redis-key";
import { BadRequestException, NotFoundException } from "@/errors/error";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { ResponseInvitationInput } from "@/modules/circle/interfaces/response-invitation.dto";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { postService } from "@/modules/post/service/post.service";
import { userRestrictionService } from "@/modules/user-restriction/service/user-restriction.service";
import { redisService } from "@/providers/redis.provider";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  CircleInvitationStatus,
  ExpReason,
  PostScoreLabel,
  RoleMembership,
  Visibility,
} from "@prisma/client";
import { evaluationProducer } from "../../job/evaluation-post/producer/evaluation.producer";
import {
  CirclePostBodyDto,
  CirclePostsQueryDto,
  CircleRepliesQueryDto,
  CprBodyDto,
  ExpLogQueryDto,
  SacrificeBodyDto,
} from "../dto/runtime.dto";
import { mapCircleWithJoinStatus } from "../mapper/circle.mapper";
import { circleExpLogRepository } from "../repository/circle-exp-log.repository";
import { circleMemberRepository } from "../repository/circle-member.repository";
import { circlePostQualityLogRepository } from "../repository/circle-post-quality-log.repository";
import { circleRepository } from "../repository/circle.repository";

class CircleService {
  private readonly circleListCacheTtlSeconds = 60;

  private async getCircleListCacheVersion() {
    const versionRaw = await redisService.get(redisKey.circle.listVersion());
    const version = Number(versionRaw);
    return Number.isFinite(version) && version >= 0 ? version : 0;
  }

  private async bumpCircleListCacheVersion() {
    await redisService.incr(redisKey.circle.listVersion());
  }

  async getCircleEnergy(publicId: string) {
    return {
      publicId,
      current: 860,
      max: 1000,
      percent: 86,
      level: 3,
      exp: 240,
      expToNext: 60,
      stage: "stable",
      drainRate: 2,
      lastDrainAt: new Date().toISOString(),
    };
  }

  async getCircleExpLog(publicId: string, query: ExpLogQueryDto) {

    const logs = [
      {
        expDelta: 12,
        reason: "post_quality_done",
        createdAt: new Date().toISOString(),
        userId: "user_stub_1",
      },
      {
        expDelta: -4,
        reason: "energy_drain",
        createdAt: new Date(Date.now() - 60_000).toISOString(),
        userId: "system",
      },
    ].slice(0, query.take ?? 20);

    return {
      publicId,
      logs,
      nextCursor: query.after ? null : "exp_log_cursor_stub",
    };
  }

  async createCirclePost(
    publicId: string,
    userId: string,
    body: CirclePostBodyDto,
  ) {
    // 1. Verify circle exists and get its ID
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException("Circle not found");
    }

    // 2. Check rate limit (5 posts/hour per user per circle)
    const rateLimitKey = `circle:post:limit:${userId}:${publicId}:${Math.floor(Date.now() / (60 * 60 * 1000))}`;
    const postCount = await redisService.incr(rateLimitKey);

    if (postCount === 1) {
      // Set expiry only on first increment (1 hour)
      await redisService.expire(rateLimitKey, 3600);
    }

    if (postCount > 5) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }

    // 3. Check user restriction (if restricted, cannot post)
    await userRestrictionService.getActiveRestriction(userId);
    // 4. Create circle post via shared post pipeline
    const post = await postService.createCircle({
      ...body,
      userId,
    });

    if (!post.id) {
      throw new BadRequestException("Failed to create post");
    }

    // 5. Keep circle-post mapping + pending quality status
    const qualityLog = await circlePostQualityLogRepository.create({
      circleId: circle.id,
      postId: post.id,
      score: 0,
      hpDelta: 0,
    });

    // 6. Enqueue evaluation job
    await evaluationProducer.enqueueEvaluationPost({
      postId: post.id,
      circlePublicId: publicId,
      userId,
      content: body.content,
      // topics: post, // You can add topic extraction logic here if needed
    });

    return {
      postId: post.id,
      publicId: post.publicId,
      circleId: circle.id,
      userId: post.userId,
      content: post.content,
      qualityLog: {
        score: qualityLog.score,
        label: PostScoreLabel.PENDING,
        hpDelta: qualityLog.hpDelta,
        expDelta: qualityLog.expDelta,
        reason: qualityLog.reason,
        confidence: qualityLog.confidence,
        isToxic: qualityLog.isToxic,
        isSpam: qualityLog.isSpam,
        createdAt: qualityLog.createdAt,
      },
      createdAt: post.createdAt,
    };
  }

  async getCirclePosts(publicId: string, query: CirclePostsQueryDto) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }

    const take = query.take ?? 20;
    const sort = query.sort ?? "latest";
    const logs = await circlePostQualityLogRepository.findCirclePosts({
      circleId: circle.id,
      after: query.after ?? undefined,
      take,
      sort,
    });

    const { rows, pagination } = buildCursorPagination({
      rows: logs,
      take,
      getAfter: (item) => item.post.publicId,
    });

    return {
      rows: rows.map((item) => ({
        postId: item.post.id,
        publicId: item.post.publicId,
        userId: item.post.userId,
        content: item.post.content,
        createdAt: item.post.createdAt,
        userSnapshot: item.post.userSnapshot,
        qualityLog: {
          score: item.score,
          label: item.label,
          hpDelta: item.hpDelta,
          expDelta: item.expDelta,
          reason: item.reason,
          confidence: item.confidence,
          isToxic: item.isToxic,
          isSpam: item.isSpam,
          createdAt: item.createdAt,
        },
      })),
      pagination,
    };
  }

  async createCircleReply(
    publicId: string,
    postPublicId: string,
    userId: string,
    body: CirclePostBodyDto,
  ) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException("Circle not found");
    }
    const parentInCircle =
      await circlePostQualityLogRepository.findByCircleAndPostPublicId(
        circle.id,
        postPublicId,
      );
    if (!parentInCircle) {
      throw new NotFoundException("Circle post not found");
    }

    await userRestrictionService.getActiveRestriction(userId);

    const post = await postService.createCircleReply(postPublicId, {
      ...body,
      userId,
    });

    if (!post.id) {
      throw new BadRequestException("Failed to create reply");
    }

    const qualityLog = await circlePostQualityLogRepository.create({
      circleId: circle.id,
      postId: post.id,
      score: 0,
      hpDelta: 0,
    });

    await evaluationProducer.enqueueEvaluationPost({
      postId: post.id,
      circlePublicId: publicId,
      userId,
      content: body.content,
    });

    return {
      postId: post.id,
      publicId: post.publicId,
      circleId: circle.id,
      userId: post.userId,
      content: post.content,
      qualityLog: {
        score: qualityLog.score,
        label: PostScoreLabel.PENDING,
        hpDelta: qualityLog.hpDelta,
        expDelta: qualityLog.expDelta,
        reason: qualityLog.reason,
        confidence: qualityLog.confidence,
        isToxic: qualityLog.isToxic,
        isSpam: qualityLog.isSpam,
        createdAt: qualityLog.createdAt,
      },
      createdAt: post.createdAt,
    };
  }

  async getCircleReplies(
    publicId: string,
    postPublicId: string,
    query: CircleRepliesQueryDto,
  ) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }
    const parentInCircle =
      await circlePostQualityLogRepository.findByCircleAndPostPublicId(
        circle.id,
        postPublicId,
      );
    if (!parentInCircle) {
      throw new NotFoundException("Circle post not found");
    }

    const take = query.take ?? 20;
    const { posts, pagination } = await postService.getCircleReplies({
      after: query.after ?? undefined,
      take,
      publicId: postPublicId,
    });

    return {
      rows: posts,
      pagination,
    };
  }

  async createCprSession(publicId: string, userId: string, body: CprBodyDto) {
    return {
      requestedBy: userId,
      circlePublicId: publicId,
      targetComments: body.targetComments,
      sessionId: Date.now(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      postId: 9001,
    };
  }

  async getCprStatus(publicId: string) {
    return {
      circlePublicId: publicId,
      active: true,
      currentComments: 4,
      targetComments: 10,
      timeLeft: 1520,
      expiresAt: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    };
  }

  async sacrificeKarma(
    publicId: string,
    userId: string,
    body: SacrificeBodyDto,
  ) {
    return {
      circlePublicId: publicId,
      userId,
      karmaSpent: body.karmaAmount,
      hpGained: Math.max(1, Math.floor(body.karmaAmount / 5)),
      newKarma: 1000 - body.karmaAmount,
      restrictionUntil: null,
      badgeGranted: true,
    };
  }

  async getCircleStats(publicId: string) {
    return {
      circlePublicId: publicId,
      totalPosts: 120,
      deepTalkCount: 45,
      averageScore: 0.82,
      topContributors: [
        { userId: "user_stub_1", totalPosts: 17, karmaSpent: 60 },
        { userId: "user_stub_2", totalPosts: 12, karmaSpent: 20 },
      ],
      cprCount: 2,
      sacrificeCount: 9,
    };
  }

  async getCircle(publicId?: string, take: number = 10, userId?: string) {
    const cacheVersion = await this.getCircleListCacheVersion();
    const cacheKey = redisKey.circle.list(
      cacheVersion,
      publicId ?? "first",
      take,
      userId ?? "anonymous",
    );
    const cached = await redisService.get(cacheKey);

    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // Ignore malformed cache and fall through to DB query.
      }
    }

    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where: {
        visibility: {
          not: Visibility.CIRCLE,
        },
      },
    });

    const circleIds = circles.map((circle) => circle.id);
    let pendingCircleIdSet = new Set<number>();
    let joinedCircleIdSet = new Set<number>();

    if (userId && circleIds.length) {
      const [pendingInvitations, memberships] = await Promise.all([
        circleInvitationRepository.findPendingInvitationsByCircleIds(
          circleIds,
          userId,
        ),
        circleMemberRepository.findMembershipsByCircleIds(circleIds, userId),
      ]);

      pendingCircleIdSet = new Set(
        pendingInvitations.map((invitation) => invitation.circleId),
      );
      joinedCircleIdSet = new Set(
        memberships.map((membership) => membership.circleId),
      );
    }

    const rows = circles.map((circle) =>
      mapCircleWithJoinStatus(circle, {
        pendingCircleIdSet,
        joinedCircleIdSet,
      }),
    );

    const result = buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });

    await redisService.set(cacheKey, JSON.stringify(result), {
      EX: this.circleListCacheTtlSeconds,
    });

    return result;
  }

  async getMembers({
    circlePublicId,
    memberId,
    take,
  }: {
    circlePublicId: string;
    memberId?: string;
    take: number;
  }) {
    const circle = await circleRepository.findByPublicId(circlePublicId);

    if (!circle) {
      throw new NotFoundException(`Circle ${circlePublicId} not found`);
    }

    const members = await circleMemberRepository.findMembersByCircleIdAndUserId(
      circle.id,
      memberId,
      take // or whatever default take value you want
    );
    return buildCursorPagination({
      rows: members,
      take,
      getAfter: (item) => item.userId,
    });
  }

  async getCircleDetail(publicId: string) {
    const circle = await circleRepository.findByPublicId(publicId);

    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }

    const energy = circle.circleEnergies[0] ?? {
      current: 500,
      max: 1000,
      peak: 500,
      createdAt: circle.createdAt,
    };

    return {
      id: circle.id,
      publicId: circle.publicId,
      name: circle.name,
      description: circle.description,
      visibility: circle.visibility,
      memberCount: circle._count.circleMembers,
      energy,
      createdAt: circle.createdAt,
      updatedAt: circle.updatedAt,
    };
  }

  async createCircle(data: CreateCircleInput) {
    const newCircle = await circleRepository.create({
      name: data.name,
      visibility: data.visibility,
      createById: data.createById,
      description: data.description,
    });

    await this.bumpCircleListCacheVersion();
    return newCircle;
  }

  async sendInvitation(data: SendInvitationInput) {
    const circle = await circleMemberRepository.findByCircleId(
      data.circleId,
      data.userId,
    );
    if (circle.length > 0) {
      throw new Error(
        `User ${data.userId} is already a member of circle ${data.circleId}`,
      );
    }

    const userRole = await circleMemberRepository.findRoleByCircleId(
      data.circleId,
      data.inviterId,
    );
    if (!userRole) {
      throw new Error(
        `User ${data.inviterId} is not a member of circle ${data.circleId}`,
      );
    }
    if (
      userRole.role !== RoleMembership.ADMIN &&
      userRole.role !== RoleMembership.OWNER
    ) {
      throw new Error(
        `User ${data.inviterId} is not an admin or owner of circle ${data.circleId}`,
      );
    }
    const existingInvitation =
      await circleInvitationRepository.findInvitationById(
        data.circleId,
        data.userId,
      );

    const invitationResendLimit = 5;
    // Vẫn cho mời lại người đã từ chối, tối đa 5 lần resentCount nếu quá 5 lần thì không mời được nữa
    if (existingInvitation) {
      if (existingInvitation.resentCount >= invitationResendLimit) {
        throw new Error(
          `User ${data.userId} has already been invited to join circle ${data.circleId}`,
        );
      }
      if (existingInvitation.status === CircleInvitationStatus.ACCEPTED) {
        throw new Error(
          `User ${data.userId} has already accepted the invitation`,
        );
      }
    }

    const invitation = await transactionService.doInTransaction(async (tx) => {
      return await circleInvitationRepository.upsert(
        {
          circleId: data.circleId,
          userId: data.userId,
          inviterId: data.inviterId,
        },
        tx,
      );
    });

    await this.bumpCircleListCacheVersion();
    return invitation;
  }

  async acceptInvitation(data: ResponseInvitationInput) {
    const circle = await circleMemberRepository.findByCircleId(
      data.circleId,
      data.userId,
    );
    if (circle.length > 0) {
      throw new Error(
        `User ${data.userId} is already a member of circle ${data.circleId}`,
      );
    }
    const invitation = await circleInvitationRepository.findInvitationById(
      data.circleId,
      data.userId,
    );

    if (!invitation) {
      throw new Error(
        `No invitation found for user ${data.userId} to join circle ${data.circleId}`,
      );
    }

    if (data.status === CircleInvitationStatus.REJECTED) {
      const rejected = await transactionService.doInTransaction(async (tx) => {
        await circleInvitationRepository.rejectInvitation(
          data.circleId,
          data.userId,
          tx,
        );
      });
      await this.bumpCircleListCacheVersion();
      return rejected;
    }

    const member = await transactionService.doInTransaction(async (tx) => {
      await circleInvitationRepository.acceptInvitation(
        data.circleId,
        data.userId,
        tx,
      );
      const member = await circleMemberRepository.create(
        {
          circleId: data.circleId,
          userId: data.userId,
        },
        tx,
      );

      const existingJoinLog = await circleExpLogRepository.findMemberJoinLog(
        data.circleId,
        data.userId,
        tx,
      );

      if (!existingJoinLog) {
        await circleExpLogRepository.create(
          {
            userId: data.userId,
            circleId: data.circleId,
            expReason: ExpReason.MEMBER_JOIN,
            expDelta: 5,
            isDelta: false,
          },
          tx,
        );
      }

      return member;
    });

    await this.bumpCircleListCacheVersion();
    return member;
  }

  async getRequestInvitation(
    userId: string,
    invitationId?: string,
    take: number = 10,
  ) {
    const invitations = await circleInvitationRepository.findInvitations(
      userId,
      invitationId,
      take,
    );

    return buildCursorPagination({
      rows: invitations,
      take,
      getAfter: (item) => String(item.id),
    });
  }
}
export const circleService = new CircleService();
