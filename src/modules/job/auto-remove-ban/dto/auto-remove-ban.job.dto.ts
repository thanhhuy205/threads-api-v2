/**
 * External BullMQ job payload for the auto-remove-ban queue.
 * This is "external" because it is serialized into Redis by the producer.
 */
export type AutoRemoveBanJobDto = {
  /**
   * Who created the job payload.
   * scheduler = repeat job; manual = future manual enqueue/admin action.
   */
  triggeredBy?: "scheduler" | "manual";

  /**
   * ISO timestamp recorded when the producer enqueues the repeat job payload.
   */
  requestedAt?: string;
};
