import { ResponseInvitationDto } from "@/modules/circle/dto/response-invitation.dto";
import type { SendInvitationDto } from "@/modules/circle/dto/send-invitation.dto";
import { getPagination } from "@/shared/pagination/cursor-pagination";
import type { Request, Response } from "express";
import { circleService } from "../service/circle.service";

class CircleController {
  async getCircle(req: Request, res: Response) {
    const { after: publicId, take } = getPagination(req);
    const circle = await circleService.getCircle(publicId ?? undefined, take);
    return res.paginate(circle);
  }

  async getCircleDetail(
    req: Request<{ publicId: string }>,
    res: Response,
  ) {
    const { publicId } = req.params;
    const circle = await circleService.getCircleDetail(publicId);
    return res.success(200, "Circle detail retrieved successfully", circle);
  }

  async getMembers(req: Request<{ publicId: string }, {} , {} , {after?: string , take: number }>, res: Response) {
    const { publicId } = req.params;
    const userId = req.user?.sub;
    if (!userId) {
      return res.error(401, "Unauthorized");
    }
    const { after: memberId, take } = getPagination(req);
    const members = await circleService.getMembers({
      circlePublicId: publicId,
      memberId: memberId ?? undefined,
      take,
    });
    return res.success(200, "Circle members retrieved successfully", members);
  }


  async createCircle(req: Request, res: Response) {
    const circle = await circleService.createCircle(req.body);
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
