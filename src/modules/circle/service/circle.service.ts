import { NotFoundException } from "@/errors/error";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { ResponseInvitationInput } from "@/modules/circle/interfaces/response-invitation.dto";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { circleInvitationRepository } from "@/modules/circle/repository/circle-invation.repository";
import { buildCursorPagination } from "@/shared/pagination/cursor-pagination";
import { transactionService } from "@/shared/transaction/transaction.service";
import {
  CircleInvitationStatus,
  RoleMembership,
  Visibility,
} from "@prisma/client";
import {
  CirclePostBodyDto,
  CirclePostsQueryDto,
  CprBodyDto,
  ExpLogQueryDto,
  SacrificeBodyDto,
} from "../dto/runtime.dto";
import { circleMemberRepository } from "../repository/circle-member.repository";
import { circleRepository } from "../repository/circle.repository";

class CircleService {
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
    const limit = query.limit ?? 20;
    const cursor = query.cursor ?? null;

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
    ].slice(0, limit);

    return {
      publicId,
      logs,
      nextCursor: cursor ? null : "exp_log_cursor_stub",
    };
  }

  async createCirclePost(
    publicId: string,
    userId: string,
    body: CirclePostBodyDto,
  ) {
    return {
      postId: Date.now(),
      circlePublicId: publicId,
      userId,
      content: body.content,
      parentId: body.parentId ?? null,
      judgeStatus: "pending",
      qualityScore: null,
      createdAt: new Date().toISOString(),
    };
  }

  async getCirclePosts(publicId: string, query: CirclePostsQueryDto) {
    return {
      circlePublicId: publicId,
      stage: "stable",
      posts: [
        {
          postId: 1001,
          content: "Skeleton post for circle feed",
          qualityScore: 0.91,
          judgeStatus: "done",
          createdAt: new Date().toISOString(),
        },
      ],
      nextCursor: query.cursor ? null : "circle_posts_cursor_stub",
      limit: query.limit ?? 20,
      sort: query.sort ?? "latest",
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

  async getCircle(publicId?: string, take: number = 10) {
    const circles = await circleRepository.findCircles({
      after: publicId,
      take,
      where: {
        visibility: {
          not: Visibility.CIRCLE,
        },
      },
    });

    return buildCursorPagination({
      rows: circles,
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

    return await transactionService.doInTransaction(async (tx) => {
      return await circleInvitationRepository.upsert(
        {
          circleId: data.circleId,
          userId: data.userId,
          inviterId: data.inviterId,
        },
        tx,
      );
    });
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
      return await transactionService.doInTransaction(async (tx) => {
        await circleInvitationRepository.rejectInvitation(
          data.circleId,
          data.userId,
          tx,
        );
      });
    }

    return await transactionService.doInTransaction(async (tx) => {
      await circleInvitationRepository.acceptInvitation(
        data.circleId,
        data.userId,
        tx,
      );
      return await circleMemberRepository.create(
        {
          circleId: data.circleId,
          userId: data.userId,
        },
        tx,
      );
    });
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
