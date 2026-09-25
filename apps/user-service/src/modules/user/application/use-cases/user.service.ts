import type {
  MeCommand,
  OnboardingCommand,
  UpdateProfileCommand,
} from '../commands';
import type {
  CurrentUserProfile,
} from '../result';

export const USER_SERVICE = Symbol('USER_SERVICE');

export interface UserService {
  updateProfile(command: UpdateProfileCommand): Promise<any>;
  onboarding(command: OnboardingCommand): Promise<any>;
  me(command: MeCommand): Promise<CurrentUserProfile | null>;
  getMyStatusProfile(identity: string): Promise<any>;
  findByUserId(identity: string): Promise<any>;
  findExistingIds(userIds: string[]): Promise<string[]>;
}
