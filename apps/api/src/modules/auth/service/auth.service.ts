import type { SessionMetadata } from '../interfaces/session-metadata';
import type {
  ForgotPasswordDto,
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
  UpdateProfileDto,
  ValidateEmailDto,
  ValidateTokenDto,
  ValidateUsernameDto,
} from '../dto/request/auth.request';
import type { AuthMeResponseDto, AuthSessionResponseDto } from '../dto/response/auth.response';
import type { ForgotPasswordResponseDto } from '../dto/response/forgot-password.response.dto';
import type { UpdateProfileDataDto } from '../dto/response/update-profile.response.dto';
import type { ValidateTokenResponseDto } from '../dto/response/validate-token.response.dto';
import type { ValidateUserResponseDto } from '../dto/response/validate-user.response.dto';

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');

export interface AuthService {
  register(payload: RegisterDto, metadata: SessionMetadata): Promise<AuthSessionResponseDto>;
  forgotPassword(payload: ForgotPasswordDto): Promise<ForgotPasswordResponseDto>;
  updateProfile(userId: string, payload: UpdateProfileDto): Promise<UpdateProfileDataDto>;
  login(payload: LoginDto, metadata: SessionMetadata): Promise<AuthSessionResponseDto | null>;
  resendVerifyEmail(originUrl: string, userId?: string): Promise<void>;
  verifyEmail(payload: ValidateTokenDto): Promise<void>;
  validateEmail(payload: ValidateEmailDto): Promise<ValidateUserResponseDto>;
  validateUsername(payload: ValidateUsernameDto): Promise<ValidateUserResponseDto>;
  validateResetPasswordToken(token: string): Promise<ValidateTokenResponseDto>;
  resetPassword(payload: ResetPasswordDto): Promise<void>;
  refreshToken(payload: RefreshTokenDto, metadata: SessionMetadata): Promise<any | null>;
  me(userId: string): Promise<AuthMeResponseDto | null>;
  logout(accessToken: string, payload: LogoutDto): Promise<void>;
}
