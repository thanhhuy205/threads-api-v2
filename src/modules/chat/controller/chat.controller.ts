import type { Request, Response } from "express";
import { chatService } from "@/modules/chat/service/chat.service";

class ChatController {
  async sendMessage(req: Request, res: Response) {
    const { receiverId, content } = req.body;
    // Assuming req.user exists from auth middleware
    const senderId = req.user?.id as string;
    const result = await chatService.sendMessage(senderId, receiverId, content);
    return res.success(200, "Message sent", result);
  }

  async markAsSeen(req: Request, res: Response) {
    const messageIds = req.body.messageIds as string[];
    const userId = req.user?.id as string;
    const result = await chatService.markAsSeen(messageIds, userId);
    return res.success(200, "Message marked as seen", result);
  }
}

export const chatController = new ChatController();
