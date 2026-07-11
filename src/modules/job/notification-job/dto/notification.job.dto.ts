/**
 * External BullMQ job payload for the notification batching queue.
 * Serialized into Redis by the notification producer.
 */
export type NotificationJobDto = {
  /**
   * Trigger source used for logging and future reporting.
   */
  triggeredBy?: "scheduler" | "manual";

  /**
   * ISO timestamp recorded by producer when enqueuing job.
   */
  requestedAt?: string;
};
