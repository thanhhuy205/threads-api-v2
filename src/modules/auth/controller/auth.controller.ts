import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import configService from '@/config/config';
import { Message } from '@/common/decorators/message.decorator';
import { AccessTokenGuard } from '@/common/guards/access-token.guard';
import { RefreshTokenHeaderGuard } from '@/common/guards/refresh-token-header.guard';
import { AUTH_MESSAGE } from '@/constants/message';
import {
  NotFoundException,
  UnauthorizedException,
} from '@/errors/error';
import { ForgotPasswordDto } from '../dto/request/forgot-password.request.dto';
import { LoginDto } from '../dto/request/login.request.dto';
import { RegisterDto } from '../dto/request/register.request.dto';
import { ResetPasswordDto } from '../dto/request/reset-password.request.dto';
import { UpdateProfileDto } from '../dto/request/update-profile.request.dto';
import { ValidateEmailDto } from '../dto/request/validate-email.request.dto';
import { ValidateTokenDto } from '../dto/request/validate-token.request.dto';
import { ValidateUsernameDto } from '../dto/request/validate-username.request.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Message(AUTH_MESSAGE.REGISTER_SUCCESS)
  register(@Body() payload: RegisterDto, @Req() request: Request) {
    return this.authService.register(payload, this.sessionMetadata(request));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.LOGIN_SUCCESS)
  async login(@Body() payload: LoginDto, @Req() request: Request) {
    const user = await this.authService.login(payload, this.sessionMetadata(request));
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);
    }
    return user;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS)
  forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }

  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Message(AUTH_MESSAGE.UPDATE_USER_SUCCESS)
  updateProfile(@Body() payload: UpdateProfileDto, @Req() request: Request) {
    return this.authService.updateProfile(this.userId(request), payload);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenHeaderGuard)
  @Message(AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS)
  async refreshToken(
    @Headers('x-refresh-token') refreshToken: string,
    @Req() request: Request,
  ) {
    const tokenPair = await this.authService.refreshToken(
      { refreshToken },
      this.sessionMetadata(request),
    );
    if (!tokenPair) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return tokenPair;
  }

  @Get('me')
  @UseGuards(AccessTokenGuard)
  @Message(AUTH_MESSAGE.GET_ME_SUCCESS)
  async me(@Req() request: Request) {
    const user = await this.authService.me(this.userId(request));
    if (!user) {
      throw new NotFoundException(AUTH_MESSAGE.USER_NOT_FOUND);
    }
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard, RefreshTokenHeaderGuard)
  @Message(AUTH_MESSAGE.LOGOUT_SUCCESS)
  async logout(
    @Headers('x-refresh-token') refreshToken: string,
    @Req() request: Request,
  ) {
    await this.authService.logout(request.accessToken as string, { refreshToken });
    return null;
  }

  @Post('resend-verify-email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Message(AUTH_MESSAGE.RESEND_VERIFY_EMAIL_SUCCESS)
  async resendVerifyEmail(
    @Headers('x-origin-url') originUrl: string | undefined,
    @Req() request: Request,
  ) {
    await this.authService.resendVerifyEmail(
      originUrl ?? configService.APP_CONFIG.FRONTEND_URL,
      this.userId(request),
    );
    return null;
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.VERIFY_EMAIL_SUCCESS)
  async verifyEmail(@Body() payload: ValidateTokenDto) {
    await this.authService.verifyEmail(payload);
    return null;
  }

  @Post('validate/email')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.VALIDATE_EMAIL_SUCCESS)
  validateEmail(@Body() payload: ValidateEmailDto) {
    return this.authService.validateEmail(payload);
  }

  @Post('validate/username')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.VALIDATE_USERNAME_SUCCESS)
  validateUsername(@Body() payload: ValidateUsernameDto) {
    return this.authService.validateUsername(payload);
  }

  @Get('reset-password/validate')
  @Message(AUTH_MESSAGE.VALIDATE_RESET_PASSWORD_TOKEN_SUCCESS)
  validateResetPasswordToken(@Query() query: ValidateTokenDto) {
    return this.authService.validateResetPasswordToken(query.token);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.RESET_PASSWORD_SUCCESS)
  async resetPassword(@Body() payload: ResetPasswordDto) {
    await this.authService.resetPassword(payload);
    return null;
  }

  private userId(request: Request): string {
    const userId = request.user?.sub;
    if (!userId) {
      throw new UnauthorizedException(AUTH_MESSAGE.TOKEN_INVALID);
    }
    return userId;
  }

  private sessionMetadata(request: Request) {
    return {
      ip: request.ip ?? 'unknown',
      userAgent: request.headers['user-agent']?.toString() ?? 'unknown',
    };
  }
}
