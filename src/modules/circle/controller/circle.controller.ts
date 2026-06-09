import { SendInvitationManageDto } from "@/modules/circle/dto/admin-circle.dto";
import {
  BanCircleMemberDto,
  KickCircleMemberDto,
} from "@/modules/circle/dto/manage-member.dto";
import {
  ResendInvitationDto,
  RespondJoinRequestDto,
  ResponseInvitationDto,
} from "@/modules/circle/dto/response-invitation.dto";
import type { SendInvitationDto } from "@/modules/circle/dto/send-invitation.dto";
import { getPagination as getCursorPagination } from "@/shared/pagination/cursor-pagination";
import { getPagination as getOffsetPagination } from "@/shared/pagination/pagination";
import type { Request, Response } from "express";
import {
  CirclePostBodyDto,
  CirclePostsQueryDto,
  CirclePublicIdParamsDto,
  CircleRepliesQueryDto,
  CircleReplyBodyDto,
  CircleReplyParamsDto,
  CircleStatsQueryDto,
  CprBodyDto,
  ExpLogQueryDto,
  OffsetLimitQueryDto,
  SacrificeBodyDto,
} from "../dto/runtime.dto";
import { circleService } from "../service/circle.service";

class CircleController {
  async getCircle(req: Request, res: Response) {
    const { after: publicId, take } = getCursorPagination(req);
    const visibility =
      typeof req.query.visibility === "string"
        ? req.query.visibility
        : undefined;
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const circle = await circleService.getCircle(
      publicId ?? undefined,
      take,
      userId,
      visibility,
    );
    return res.paginate(circle);
  }

  async getMyJoinedCircles(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { after, take } = getCursorPagination(req);
    const circles = await circleService.getMyJoinedCircles(
      userId,
      after ?? undefined,
      take,
    );

    return res.paginate(circles);
  }

  async getMyOwnerCircles(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { after, take } = getCursorPagination(req);
    const circles = await circleService.getMyOwnerCircles(
      userId,
      after ?? undefined,
      take,
    );

    return res.paginate(circles);
  }

  async getCircleDetail(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const circle = await circleService.getCircleDetail(publicId, userId);
    return res.success(200, "Circle detail retrieved successfully", circle);
  }

  async getMembers(req: Request<CirclePublicIdParamsDto>, res: Response) {
    const { publicId } = req.params;

    const { after: memberId, take } = getCursorPagination(req);
    const members = await circleService.getMembers({
      circlePublicId: publicId,
      memberId: memberId ?? undefined,
      take,
    });
    return res.paginate(members);
  }

  async getCircleEnergy(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const data = await circleService.getCircleEnergy(publicId);
    return res.success(200, "Circle energy retrieved successfully", data);
  }

  async getCircleExpLog(
    req: Request<CirclePublicIdParamsDto, {}, {}, ExpLogQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.getCircleExpLog(
      publicId,
      userId,
      req.query_parsed,
    );
    return res.success(200, "Circle exp log retrieved successfully", data.rows, {
      pagination: data.pagination,
    });
  }

  async getAllCirclePostQualityLog(
    req: Request<CirclePublicIdParamsDto, {}, {}, ExpLogQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const { currentPage, perPage } = getOffsetPagination(req);
    const data = await circleService.getAllCirclePostQualityLog(
      publicId,
      userId,
      {
        page: currentPage,
        limit: perPage,
      },
    );
    return res.success(
      200,
      "Circle post quality logs retrieved successfully",
      data.rows,
      {
        pagination: data.pagination,
      },
    );
  }

  async createCirclePost(
    req: Request<CirclePublicIdParamsDto, {}, CirclePostBodyDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.createCirclePost(publicId, userId, req.body);
    return res.success(202, "Post accepted for judging", data);
  }

  async getCirclePosts(
    req: Request<CirclePublicIdParamsDto, {}, {}, CirclePostsQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const { after, take } = getCursorPagination(req);
    const sort = req.query_parsed?.sort;
    const data = await circleService.getCirclePosts(publicId, userId, {
      after: after ?? undefined,
      take,
      sort: sort ?? undefined,
    });
    return res.paginate(data);
  }

  async createCircleReply(
    req: Request<CircleReplyParamsDto, {}, CircleReplyBodyDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId, postPublicId } = req.params;
    const data = await circleService.createCircleReply(
      publicId,
      postPublicId,
      userId,
      req.body,
    );
    return res.success(202, "Reply accepted for judging", data);
  }

  async getCircleReplies(
    req: Request<CircleReplyParamsDto, {}, {}, CircleRepliesQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId, postPublicId } = req.params;
    const data = await circleService.getCircleReplies(
      publicId,
      postPublicId,
      userId,
      req.query_parsed,
    );
    return res.paginate(data);
  }

  async createCprSession(
    req: Request<CirclePublicIdParamsDto, {}, CprBodyDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.createCprSession(publicId, userId, req.body);
    return res.success(201, "CPR session created", data);
  }

  async getCprStatus(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const data = await circleService.getCprStatus(publicId);
    return res.success(200, "CPR status retrieved successfully", data);
  }

  async sacrificeKarma(
    req: Request<CirclePublicIdParamsDto, {}, SacrificeBodyDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.sacrificeKarma(publicId, userId, req.body);
    return res.success(200, "Karma sacrificed successfully", data);
  }

  async getCircleStats(
    req: Request<CirclePublicIdParamsDto, {}, {}, CircleStatsQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const data = await circleService.getCircleStats(
      publicId,
      userId,
      req.query_parsed.type,
    );
    return res.success(200, "Circle stats retrieved successfully", data);
  }


  async createCircle(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const circle = await circleService.createCircle({
      ...req.body,
      createById: userId,
    });
    return res.success(201, "Circle created successfully", circle);
  }

  async getRequestInvitation(req: Request, res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { after: invitationId, take } = getCursorPagination(req);
    const circle = await circleService.getRequestInvitation(
      userId,
      invitationId ?? undefined,
      take,
    );
    return res.paginate({ rows: circle.rows, pagination: circle.pagination });
  }

  async getMyInvitationDetail(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.getMyInvitationDetail(publicId, userId);
    return res.success(200, "Circle invitation detail retrieved successfully", data);
  }

  async levelUpCircle(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const data = await circleService.levelUpCircle(publicId, userId);
    return res.success(200, "Circle leveled up successfully", data);
  }

  async sendInvitation(
    req: Request<{}, {}, SendInvitationDto, {}>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { circleId, userId: targetUserId } = req.body;
    await circleService.sendInvitation({
      circleId,
      userId: targetUserId,
      inviterId: userId,
    });
    return res.success(
      200,
      `Invitation sent to user ${targetUserId} for circle ${circleId}`,
    );
  }

  async acceptInvitation(
    req: Request<{}, {}, ResponseInvitationDto, {}>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { circleId, status } = req.body;
    await circleService.acceptInvitation({
      circleId,
      userId,
      status: status === "ACCEPTED" ? "ACCEPTED" : "REJECTED",
    });
    return res.success(
      200,
      `Invitation ${status} for user ${userId} to join circle ${circleId}`,
    );
  }

  async sendJoinRequest(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const { isCancelled } = await circleService.sendJoinRequest(publicId, userId);
    return res.success(200, isCancelled ? "Join request cancelled successfully" : "Join request sent successfully", {
      isCancelled
    });
  }

  async getManageMembers(
    req: Request<CirclePublicIdParamsDto, {}, {}, OffsetLimitQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const { currentPage, perPage } = getOffsetPagination(req);
    const data = await circleService.getManageMembers(publicId, userId, {
      page: currentPage,
      limit: perPage,
    });

    return res.success(200, "Circle members retrieved successfully", data.rows, {
      pagination: data.pagination,
    });
  }

  async banMember(
    req: Request<CirclePublicIdParamsDto, {}, BanCircleMemberDto>,
    res: Response,
  ) {
    const bannedById = req.user?.sub;
    if (!bannedById) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const result = await circleService.banMember({
      publicId,
      userId: req.body.userId,
      bannedById,
      reason: req.body.reason,
      expiresAt: req.body.expiresAt ? new Date(req.body.expiresAt) : undefined,
    });

    return res.success(200, "Circle member banned successfully", result);
  }

  async kickMember(
    req: Request<CirclePublicIdParamsDto, {}, KickCircleMemberDto>,
    res: Response,
  ) {
    const managerId = req.user?.sub;
    if (!managerId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const result = await circleService.kickMember({
      publicId,
      userId: req.body.userId,
    });

    return res.success(200, "Circle member kicked successfully", result);
  }

  async getManageInvitations(
    req: Request<CirclePublicIdParamsDto, {}, {}, OffsetLimitQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const { currentPage, perPage } = getOffsetPagination(req);
    const data = await circleService.getManageInvitations(publicId, userId, {
      page: currentPage,
      limit: perPage,
    });

    return res.success(200, "Circle invitations retrieved successfully", data.rows, {
      pagination: data.pagination,
    });
  }

  async getManageInvitationStats(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const data = await circleService.getManageInvitationStats(publicId, userId);

    return res.success(
      200,
      "Circle invitation stats retrieved successfully",
      data,
    );
  }

  async resendManageInvitation(
    req: Request<CirclePublicIdParamsDto, {}, ResendInvitationDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const { id } = req.body;
    const data = await circleService.resendManageInvitation(publicId, userId, id);
    return res.success(200, "Circle invitation resent successfully", data);
  }

  async getManageJoinRequests(
    req: Request<CirclePublicIdParamsDto, {}, {}, OffsetLimitQueryDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }

    const { publicId } = req.params;
    const { currentPage, perPage } = getOffsetPagination(req);
    const data = await circleService.getManageJoinRequests(publicId, userId, {
      page: currentPage,
      limit: perPage,
    });

    return res.success(200, "Circle join requests retrieved successfully", data.rows, {
      pagination: data.pagination,
    });
  }


  async sendInvitationByAdmin(
    req: Request<CirclePublicIdParamsDto, {}, SendInvitationManageDto, {}>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const { username, role, description } = req.body;
    await circleService.sendInvitationByAdmin({
      circlePublicId: publicId,
      username,
      inviterId: userId,
      role,
      description,
    });

    return res.success(
      200,
      `Invitation sent to ${username} for circle with role ${role}`,
    );

  }

  async getUserQuantityPostInCircle(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const data = await circleService.getUserQuantityPostInCircle(publicId, userId);
    return res.success(200, "User quantity post in circle retrieved successfully", data);
  }

  async respondJoinRequest(
    req: Request<CirclePublicIdParamsDto, {}, RespondJoinRequestDto>,
    res: Response,
  ) {
    const adminId = req.user?.sub;
    if (!adminId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const { isAccept, userId } = req.body;
    const result = await circleService.respondJoinRequest({
      publicId,
      adminId,
      userId,
      isAccept,
    });
    return res.success(
      200,
      `Join request ${isAccept ? 'accept' : 'reject'} for user ${userId} to join circle ${publicId}`,
      result
    );
  }
}

export const circleController = new CircleController();
