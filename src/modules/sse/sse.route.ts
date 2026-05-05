import { authorization } from '@/middlewares/auth';
import { sseService } from '@/modules/sse';
import { sseController } from '@/modules/sse/controller/sse.controller';
import { Router } from 'express';

const sseRouter = Router();

sseRouter.get('/event', authorization, sseController.connect);

sseRouter.get('/heartbeat', authorization, (req, res) => {
    const userId = req.user?.sub;

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const sentCount = sseService.sendNotificationToUser(userId, {
        title: 'Test thông báo',
        message: 'Hello từ BE!',
        type: 'success',
    });

    res.status(200).json({
        success: true,
        userId,
        sentCount,
        message:
            sentCount > 0
                ? 'Đã bắn notification qua SSE'
                : 'Không có SSE connection nào đang sống',
    });
});
export default sseRouter;