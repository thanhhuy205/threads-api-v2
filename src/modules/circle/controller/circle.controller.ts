import { ResponseInvitationDto } from "@/modules/circle/dto/response-invitation.dto";
import type { SendInvitationDto } from "@/modules/circle/dto/send-invitation.dto";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import type { Request, Response } from "express";
import {
  CirclePostBodyDto,
  CirclePostsQueryDto,
  CirclePublicIdParamsDto,
  CprBodyDto,
  ExpLogQueryDto,
  SacrificeBodyDto,
} from "../dto/runtime.dto";
import { circleService } from "../service/circle.service";

class CircleController {
  async getCircle(req: Request, res: Response) {
    const { after: publicId, take } = getPagination(req);
    const circle = await circleService.getCircle(publicId ?? undefined, take);
    return res.paginate(circle);
  }

  async getCircleDetail(
    req: Request<CirclePublicIdParamsDto>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const circle = await circleService.getCircleDetail(publicId);
    return res.success(200, "Circle detail retrieved successfully", circle);
  }

  async getMembers(req: Request<CirclePublicIdParamsDto>, res: Response) {
    const { publicId } = req.params;

    const { after: memberId, take } = getPagination(req);
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
    const { publicId } = req.params;
    const data = await circleService.getCircleExpLog(publicId, req.query_parsed);
    return res.success(200, "Circle exp log retrieved successfully", data);
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
    try {
      const data = await circleService.createCirclePost(publicId, userId, req.body);
      return res.success(202, "Post accepted for judging", data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "RATE_LIMIT_EXCEEDED") {
          return res.error(429, "Rate limit exceeded: maximum 5 posts per hour");
        }
        if (error.message === "USER_RESTRICTED") {
          return res.error(403, "You are restricted from posting");
        }
        if (error.message === "Circle not found") {
          return res.error(404, error.message);
        }
      }
      throw error;
    }
  }

  async getCirclePosts(
    req: Request<CirclePublicIdParamsDto, {}, {}, CirclePostsQueryDto>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const data = await circleService.getCirclePosts(publicId, req.query_parsed);
    return res.success(200, "Circle posts retrieved successfully", data);
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
    const { after: invitationId, take } = getPagination(req);
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
}

export const circleController = new CircleController();
