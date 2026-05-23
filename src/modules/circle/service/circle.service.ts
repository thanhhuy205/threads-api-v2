import { redisKey } from "@/constants/resolve-key/redis-key";
import { BadRequestException, ForbiddenException, NotFoundException } from "@/errors/error";
import { hasherToken } from "@/modules/auth/util/hasher-token";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { ResponseInvitationInput } from "@/modules/circle/interfaces/response-invitation.dto";
import { SendInvitationEmailAdminInterface } from "@/modules/circle/interfaces/send-invitation-admin.interface";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { CIRCLE_ROLE_PERMISSIONS, CirclePermission } from "@/modules/circle/permission/circle-permission";
import { checkCirclePermission } from "@/modules/circle/policy/check-circle-permission";
import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { circleJoinRequestRepository } from "@/modules/circle/repository/circle-join.repository";
import { emailProducer } from "@/modules/job/email/producer/email.producer";
import { postService } from "@/modules/post/service/post.service";
import { userRestrictionService } from "@/modules/user-restriction/service/user-restriction.service";
import { userService } from "@/modules/user/service/user.service";
import { redisService } from "@/providers/redis.provider";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { buildPaginationResponse } from "@/shared/pagination/pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  CircleInvitationStatus,
  PostScoreLabel,
  Prisma,
  RequestStatus,
  RoleMembership,
  Visibility,
} from "@prisma/client";
import crypto from "crypto";
import { evaluationProducer } from "../../job/evaluation-post/producer/evaluation.producer";
import {
  CircleStatsQueryDto,
  CirclePostBodyDto,
  CirclePostsQueryDto,
  CircleRepliesQueryDto,
  CircleReplyBodyDto,
  CprBodyDto,
  ExpLogQueryDto,
  SacrificeBodyDto,
} from "../dto/runtime.dto";
import { mapCircleWithJoinStatus } from "../mapper/circle.mapper";
import { circleExpLogRepository } from "../repository/circle-exp-log.repository";
import { circleMemberRepository } from "../repository/circle-member.repository";
import { circlePostQualityLogRepository } from "../repository/circle-post-quality-log.repository";
import { circleRepository } from "../repository/circle.repository";
import { circleExpLogService } from "./circle-exp-log.service";

type CircleVisibilityFilterType = "public" | "private" | "accepting" | "join" | null;

class CircleService {
  private readonly circleListCacheTtlSeconds = 60;

  private async assertCanManageCircle(
    circlePublicId: string,
    userId: string,
    requiredPermission: CirclePermission,
  ) {
    const circle = await circleRepository.findByPublicId(circlePublicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${circlePublicId} not found`);
    }

    const member = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (!member) {
      throw new ForbiddenException("You do not have permission to access this circle");
    }

    const userPermissions = CIRCLE_ROLE_PERMISSIONS[member.role] ?? [];
    const hasPermission = checkCirclePermission(userPermissions, requiredPermission);
    if (!hasPermission) {
      throw new ForbiddenException(
        `You do not have permission: ${requiredPermission}`,
      );
    }

    return circle;
  }

  private async getCircleListCacheVersion() {
    const versionRaw = await redisService.get(redisKey.circle.listVersion());
    const version = Number(versionRaw);
    return Number.isFinite(version) && version >= 0 ? version : 0;
  }

  private async bumpCircleListCacheVersion() {
    await redisService.incr(redisKey.circle.listVersion());
  }

  private normalizeCircleVisibilityFilter(
    visibility?: string,
  ): CircleVisibilityFilterType | null | undefined {
    if (visibility === undefined) {
      return undefined;
    }

    const normalized = visibility.trim().toLowerCase();
    if (normalized === "public") return "public";
    if (normalized === "private") return "private";

    return null;
  }

  private getCircleWhereByVisibilityType(
    visibilityType?: CircleVisibilityFilterType,
  ): Prisma.CircleWhereInput {
    if (!visibilityType) {
      return {};
    }

    if (visibilityType === "public") {
      return { visibility: Visibility.PUBLIC };
    }

    if (visibilityType === "private") {
      return { visibility: Visibility.PRIVATE };
    }

    return {
      visibility: Visibility.PRIVATE,
    };
  }

  private async buildCircleListResponse({
    publicId,
    take,
    userId,
    where,
  }: {
    publicId?: string;
    take: number;
    userId?: string;
    where: Prisma.CircleWhereInput;
  }) {
    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where,
    });

    const circleIds = circles.map((circle) => circle.id as number);
    let pendingCircleIdSet = new Set<number>();
    let joinedCircleIdSet = new Set<number>();

    if (userId && circleIds.length) {
      const [pendingInvitations, memberships] = await Promise.all([
        circleJoinRequestRepository.findPendingRequestByCircleId(
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

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });
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

  async getCircleExpLog(
    publicId: string,
    userId: string,
    query: ExpLogQueryDto,
  ) {
    const circle = await this.assertCanManageCircle(
      publicId,
      userId,
      CirclePermission.START_CPR,
    );
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const [rows, total] = await Promise.all([
      circleExpLogRepository.findExpLogsByCircleIdPaginated({
        circleId: circle.id,
        page,
        limit,
      }),
      circleExpLogRepository.countExpLogsByCircleId(circle.id),
    ]);

    return {
      rows,
      pagination: buildPaginationResponse(total, page, limit),
    };
  }

  async getAllCirclePostQualityLog(
    publicId: string,
    userId: string,
    query: ExpLogQueryDto,
  ) {
    const circle = await this.assertCanManageCircle(
      publicId,
      userId,
      CirclePermission.START_CPR,
    );
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const [rows, total] = await Promise.all([
      circlePostQualityLogRepository.findByCircleIdPaginated({
        circleId: circle.id,
        page,
        limit,
      }),
      circlePostQualityLogRepository.countByCircleId(circle.id),
    ]);

    return {
      rows,
      pagination: buildPaginationResponse(total, page, limit),
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
    const member = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (!member) {
      throw new ForbiddenException("You are not a member of this circle");
    }

    // 2. Check rate limit (5 posts/hour per user per circle)
    const rateLimitKey = `circle:post:limit:${userId}:${publicId}:${Math.floor(Date.now() / (60 * 60 * 1000))}`;
    const postCount = await redisService.incr(rateLimitKey); // count

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
      userId,
      circleMemberId: member.id
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
      contentJson: post.contentJson,
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

  async getCirclePosts(publicId: string, userId: string, query: CirclePostsQueryDto) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }
    const role = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (circle.visibility === Visibility.PRIVATE && !role) {
      return buildCursorPagination({
        rows: [],
        take: query.take ?? 20,
        getAfter: () => "",
      });
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
        contentJson: item.post.contentJson,
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
    body: CircleReplyBodyDto,
  ) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException("Circle not found");
    }

    const member = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (!member) {
      throw new ForbiddenException("You are not a member of this circle");
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
      circleMemberId: member.id,
      userId: userId
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
    userId: string,
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

  async getCircleStats(
    publicId: string,
    userId: string,
    type?: CircleStatsQueryDto["type"],
  ) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }

    const member = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (!member) {
      throw new ForbiddenException("You do not have permission to access this circle");
    }

    const userPermissions = CIRCLE_ROLE_PERMISSIONS[member.role] ?? [];
    const hasStatisticsPermission = checkCirclePermission(
      userPermissions,
      CirclePermission.STATISTICS,
    );
    if (!hasStatisticsPermission) {
      throw new ForbiddenException(
        `You do not have permission: ${CirclePermission.STATISTICS}`,
      );
    }

    if (member.role !== RoleMembership.OWNER) {
      throw new ForbiddenException("Only owner can access this resource");
    }

    const selectedType = type ?? "7days";
    const dayByType: Record<NonNullable<CircleStatsQueryDto["type"]>, number> = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
    };

    const to = new Date();
    const from = new Date(to);
    from.setDate(to.getDate() - dayByType[selectedType]);

    const [membersTotal, joinRequestsTotal, invitationsTotal, expLogAgg] =
      await Promise.all([
        circleMemberRepository.countMembersByCircleIdWithinRange(circle.id, from),
        circleJoinRequestRepository.countPendingByCircleIdWithinRange(circle.id, from),
        circleInvitationRepository.countPendingInvitationsByCircleIdWithinRange(circle.id, from),
        circleExpLogRepository.aggregateDeltaByCircleIdWithinRange(circle.id, from),
      ]);

    return {
      circlePublicId: publicId,
      type: selectedType,
      range: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      membersTotal,
      joinRequestsTotal,
      invitationsTotal,
      expLogsTotal: expLogAgg._count.id,
      expDeltaSum: expLogAgg._sum.expDelta ?? 0,
    };
  }

  async getCircle(
    publicId?: string,
    take: number = 10,
    userId?: string,
    visibility?: string,
  ) {
    const visibilityType = this.normalizeCircleVisibilityFilter(visibility);

    if (visibility !== undefined && visibilityType === null) {
      return buildCursorPagination({
        rows: [],
        take,
        getAfter: () => "",
      });
    }

    if (visibilityType !== undefined) {
      return this.buildCircleListResponse({
        publicId,
        take,
        userId,
        where: this.getCircleWhereByVisibilityType(visibilityType),
      });
    }

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
    const result = await this.buildCircleListResponse({
      publicId,
      take,
      userId,
      where: this.getCircleWhereByVisibilityType(undefined),
    });

    await redisService.set(cacheKey, JSON.stringify(result), {
      EX: this.circleListCacheTtlSeconds,
    });

    return result;
  }

  async getMyJoinedCircles(
    userId: string,
    publicId?: string,
    take: number = 10,
  ) {
    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where: {
        circleMembers: {
          some: {
            userId,
          },
        },
      },
    });

    const pendingCircleIdSet = new Set<number>();
    const joinedCircleIdSet = new Set(circles.map((circle) => circle.id));
    const rows = circles.map((circle) =>
      mapCircleWithJoinStatus(circle, {
        pendingCircleIdSet,
        joinedCircleIdSet,
      }),
    );

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });
  }

  async getMyOwnerCircles(
    userId: string,
    publicId?: string,
    take: number = 10,
  ) {
    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where: {
        circleMembers: {
          some: {
            userId,
            role: {
              in: [RoleMembership.ADMIN, RoleMembership.OWNER],
            },
          },
        },
      },
    });

    const pendingCircleIdSet = new Set<number>();
    const joinedCircleIdSet = new Set(circles.map((circle) => circle.id));
    const rows = circles.map((circle) =>
      mapCircleWithJoinStatus(circle, {
        pendingCircleIdSet,
        joinedCircleIdSet,
      }),
    );

    return buildCursorPagination({
      rows,
      take,
      getAfter: (item) => item.publicId,
    });
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

  async getManageMembers(
    publicId: string,
    userId: string,
    query: {
      page: number;
      limit: number;
    },
  ) {
    const circle = await this.assertCanManageCircle(
      publicId,
      userId,
      CirclePermission.KICK_MEMBER,
    );
    const [rows, total] = await Promise.all([
      circleMemberRepository.findMembersByCircleIdPaginated({
        circleId: circle.id,
        page: query.page,
        limit: query.limit,
      }),
      circleMemberRepository.countMembersByCircleId(circle.id),
    ]);

    return {
      rows,
      pagination: buildPaginationResponse(total, query.page, query.limit),
    };
  }

  async getManageInvitations(
    publicId: string,
    userId: string,
    query: {
      page: number;
      limit: number;
    },
  ) {
    const circle = await this.assertCanManageCircle(
      publicId,
      userId,
      CirclePermission.INVITE_MEMBER,
    );
    const [rows, total] = await Promise.all([
      circleInvitationRepository.findByCircleIdPaginated({
        circleId: circle.id,
        page: query.page,
        limit: query.limit,
      }),
      circleInvitationRepository.countByCircleId(circle.id),
    ]);

    return {
      rows,
      pagination: buildPaginationResponse(total, query.page, query.limit),
    };
  }

  async getManageJoinRequests(
    publicId: string,
    userId: string,
    query: {
      page: number;
      limit: number;
    },
  ) {
    const circle = await this.assertCanManageCircle(
      publicId,
      userId,
      CirclePermission.INVITE_MEMBER,
    );
    const [rows, total] = await Promise.all([
      circleJoinRequestRepository.findByCircleIdPaginated({
        circleId: circle.id,
        page: query.page,
        limit: query.limit,
      }),
      circleJoinRequestRepository.countByCircleId(circle.id),
    ]);

    return {
      rows,
      pagination: buildPaginationResponse(total, query.page, query.limit),
    };
  }

  async getCircleDetail(publicId: string, userId: string) {
    const circle = await circleRepository.findByPublicId(publicId);

    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }

    const role = await circleMemberRepository.findRoleByCircleId(circle.id, userId);

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
      isJoined: !!role,
      isAdmin: role ? (role.role === RoleMembership.ADMIN || role.role === RoleMembership.OWNER) : false,
      permission: CIRCLE_ROLE_PERMISSIONS[role?.role ?? RoleMembership.MEMBER] || [],
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

      await circleExpLogService.grantMemberJoinExpIfFirstTime({
        circleId: data.circleId,
        userId: data.userId,
        tx,
      });

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

  async sendJoinRequest(publicId: string, userId: string) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }
    const existingMember = await circleMemberRepository.findByCircleId(
      circle.id,
      userId,
    );
    if (existingMember.length > 0) {
      throw new Error(`User ${userId} is already a member of circle ${publicId}`,);
    }

    const invitation = await circleJoinRequestRepository.findJoinRequestByCircleIdAndUserId(
      circle.id,
      userId,
    );
    if (invitation) {
      if (invitation.status === CircleInvitationStatus.PENDING) {
        await circleJoinRequestRepository.updateStatus(
          invitation.id,
          RequestStatus.CANCELLED,
        );

        return {
          isCancelled: true,
        }
      }

    }


    await circleJoinRequestRepository.create({
      circleId: circle.id,
      userId,
      reason: "User requested to join the circle",
    });

    return { isCancelled: false };
  }

  async sendInvitationByAdmin({
    circlePublicId,
    email,
    inviterId,
    role,
    description,
  }: SendInvitationEmailAdminInterface) {
    const circle = await circleRepository.findByPublicId(circlePublicId);
    if (!circle) {
      throw new NotFoundException(`Circle with id ${circlePublicId} not found`);
    }

    const inviterRole = await circleMemberRepository.findRoleByCircleId(
      circle.id,
      inviterId,
    );
    if (!inviterRole) {
      throw new ForbiddenException("You are not a member of this circle");
    }
    if (inviterRole.role === RoleMembership.MEMBER) {
      throw new ForbiddenException("Only admin or owner can send invitation");
    }
    if (
      inviterRole.role === RoleMembership.ADMIN &&
      role !== RoleMembership.MEMBER
    ) {
      throw new ForbiddenException("Admin can only invite member role");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await userService.findUserByEmail(normalizedEmail);
    if (user?.id === inviterId) {
      throw new BadRequestException("You cannot invite yourself");
    }

    if (user) {
      const existingMember = await circleMemberRepository.findByCircleId(
        circle.id,
        user.id,
      );
      if (existingMember.length > 0) {
        throw new BadRequestException(
          `User ${user.id} is already a member of circle ${circlePublicId}`,
        );
      }
    }

    let existingInvitation = user
      ? await circleInvitationRepository.findInvitationByUserId(
        circle.id,
        user.id,
      )
      : null;
    if (!existingInvitation) {
      existingInvitation = await circleInvitationRepository.findInvitationByEmail(
        circle.id,
        normalizedEmail,
      );
    }

    const invitationResendLimit = 3;
    if (existingInvitation) {
      if (existingInvitation.resentCount >= invitationResendLimit) {
        throw new BadRequestException(
          `Email ${normalizedEmail} has already been invited to join circle ${circlePublicId} multiple times`,
        );
      }
      if (existingInvitation.status === CircleInvitationStatus.ACCEPTED) {
        throw new BadRequestException(
          `Email ${normalizedEmail} has already accepted the invitation to join circle ${circlePublicId}`,
        );
      }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hasherToken(token);
    await transactionService.doInTransaction(async (tx) => {
      await circleInvitationRepository.upsertAdminInvitation(
        {
          existingInvitationId: existingInvitation?.id,
          circleId: circle.id,
          userId: user?.id,
          email: normalizedEmail,
          inviterId,
          isUser: Boolean(user),
          role,
          description,
          tokenHash,
        },
        tx,
      );
    });

    await emailProducer.sendInvitationEmail({
      email: normalizedEmail,
      token,
      username: user?.username ?? normalizedEmail.split("@")[0],
    });

    await this.bumpCircleListCacheVersion();
    return {
      email: normalizedEmail,
      role,
      isUser: Boolean(user),
      circlePublicId,
    };
  }

  async countCircles() {
    return await circleRepository.count();
  }

  async findBatchCircles({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) {
    return await circleRepository.findBatch(take, skip);
  }

  async getUserQuantityPostInCircle(publicId: string, userId: string) {
    const circle = await circleRepository.findByPublicId(publicId);
    if (!circle) {
      throw new NotFoundException(`Circle ${publicId} not found`);
    }

    const member = await circleMemberRepository.findRoleByCircleId(circle.id, userId);
    if (!member) {
      throw new ForbiddenException(`User ${userId} is not a member of circle ${publicId}`);
    }

    if (member.role !== RoleMembership.OWNER) {
      throw new ForbiddenException(`Only owner can access this resource`);
    }



    // const quantity = await circlePostQualityLogRepository.countUserInCircle(circle.id);
    return {
      // circlePublicId: publicId,
      // userQuantity: quantity,
    }
  }
}
export const circleService = new CircleService();
