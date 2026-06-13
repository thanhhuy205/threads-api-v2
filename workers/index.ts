import { redisService } from '@/providers/redis.provider';

const redisReady = redisService.isOpen
    ? Promise.resolve()
    : redisService.connect();


export { autoRemoveBanWorker } from './auto-remove-ban.worker';
export { bloomWorker } from './bloom.worker';
export { deltaWorker } from './delta-hp.worker';
export { emailWorker } from './email.worker';
export { evaluateWorker } from './evaluate.worker';
export { likeWorker } from './like.worker';
export { messageWorker } from './message.worker';
export { notificationWorker } from './notification.worker';
export { pineWorker } from './pine.worker';

