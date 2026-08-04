import { redisService } from '@/providers/redis.provider';

const redisReady = redisService.isOpen
    ? Promise.resolve()
    : redisService.connect();


export { bloomWorker } from './bloom.worker';
export { emailWorker } from './email.worker';
export { evaluateWorker } from './evaluate.worker';
export { hlsWorker } from './hls.worker';
export { likeWorker } from './like.worker';
export { notificationWorker } from './notification.worker';
export { surveySyncWorker } from './survey-sync.worker';
