import { baseLogger } from '@/middlewares/logger';
import { circleEnergyService } from '@/modules/circle/service/circle-enery.service';
import { circleService } from '@/modules/circle/service/circle.service';
import { DELTA_HP_JOB_NAME, QUEUE_NAME } from '../src/constants/queue';
import { createWorker } from '../src/providers/bullmq.provider';


const batchSize = 100;

class DetailWorker {
    private readonly worker = createWorker(QUEUE_NAME.DELTA_HP_QUEUE, async (job) => {
        switch (job.name) {
            case DELTA_HP_JOB_NAME.DECREASE_HP:
                return this.process();
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    })

    async process() {
        try {
            baseLogger.info('Delta HP worker started processing');
            const countCircle = await circleService.countCircles();
            baseLogger.info(`Total circles to process: ${countCircle}`);
            const totalPages = Math.ceil(countCircle / batchSize);
            baseLogger.info(`Total pages to process: ${totalPages} with batch size: ${batchSize}`);
            for (let page = 0; page < totalPages; page++) {
                const circles = await circleService.findBatchCircles({
                    take: batchSize,
                    skip: page * batchSize,
                });

                const circleIds = [...new Set(circles.map(circle => circle.id))];
                await circleEnergyService.decreaseEnergy(circleIds);
            }
            baseLogger.info('Delta HP worker finished processing');
        } catch (error) {
            baseLogger.error(`Error processing Delta HP job: ${JSON.stringify(error)}`);
        }
    }

};

export const deltaWorker = new DetailWorker();
