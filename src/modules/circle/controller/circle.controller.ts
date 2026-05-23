import { SendInvitationEmailDto } from "@/modules/circle/dto/admin-circle.dto";
import { ResponseInvitationDto } from "@/modules/circle/dto/response-invitation.dto";
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
    const data = await circleService.getCirclePosts(publicId, userId, {
      after: after ?? undefined,
      take,
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
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const data = await circleService.getCircleStats(publicId);
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
    req: Request<CirclePublicIdParamsDto, {}, SendInvitationEmailDto, {}>,
    res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { publicId } = req.params;
    const { email, role, description } = req.body;
    await circleService.sendInvitationByAdmin({
      circlePublicId: publicId,
      email,
      inviterId: userId,
      role,
      description,
    });

    return res.success(
      200,
      `Invitation sent to ${email} for circle ${publicId} with role ${role}`,
    );

  }
}

export const circleController = new CircleController();
