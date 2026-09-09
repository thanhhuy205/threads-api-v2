import type { Subject } from '@casl/ability';

export type Action = string;

export const ABILITY_SERVICE = Symbol('ABILITY_SERVICE');

export interface AbilityService {
  assertCan(
    userId: string,
    action: Action,
    subject: Subject,
    resource?: unknown,
  ): Promise<void>;
}
