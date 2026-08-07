import { AUTH_MESSAGE } from "@/constants/message";
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Message } from '@/common/decorators/message.decorator';
import { LoginDto } from "@/modules/auth/dto/request/login.request.dto";
import { UnauthorizedException } from '@/errors/error';
import { AdminAuthService } from "./admin-auth.service";

type RequestMetadata = { ip?: string; headers: Record<string, string | string[] | undefined> };

@ApiTags('Admin')
@Controller('admin')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Message(AUTH_MESSAGE.LOGIN_SUCCESS)
  @ApiOperation({ summary: 'Log in with an admin or moderator account' })
  @ApiResponse({ status: HttpStatus.OK, description: AUTH_MESSAGE.LOGIN_SUCCESS })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: AUTH_MESSAGE.INVALID_CREDENTIALS })
  async login(@Body() payload: LoginDto, @Req() request: RequestMetadata) {
    const user = await this.adminAuthService.login(payload, {
      ip: request.ip ?? "unknown",
      userAgent: request.headers["user-agent"]?.toString() ?? "unknown",
    });

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGE.INVALID_CREDENTIALS);
    }

    return user;
  }
}
