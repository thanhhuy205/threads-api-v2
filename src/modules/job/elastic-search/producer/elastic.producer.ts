import { ELASTIC_JOB_NAME, QUEUE_NAME } from "@/constants/queue";
import type { ElasticPostRequestDto } from "@/modules/job/elastic-search/dto/elastic-post.request.dto";
import type { ElasticUserRequestDto } from "@/modules/job/elastic-search/dto/elastic-user.request.dto";
import { createQueue } from "@/providers/bullmq.provider";
import { Queue } from "bullmq";

class ElasticProducer {
  private readonly elasticQueue: Queue;

  constructor() {
    this.elasticQueue = createQueue(QUEUE_NAME.ELASTIC_QUEUE);
  }

  async addPostToElasticQueue(payload: ElasticPostRequestDto) {
    await this.elasticQueue.add(ELASTIC_JOB_NAME.ADD_POST, payload);
  }

  async addUserToElasticQueue(payload: ElasticUserRequestDto) {
    await this.elasticQueue.add(ELASTIC_JOB_NAME.ADD_USER, payload);
  }
}

export const elasticProducer = new ElasticProducer();
