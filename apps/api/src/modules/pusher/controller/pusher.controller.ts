import { BadRequestException, ForbiddenException, UnauthorizedException } from "@/errors/error";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
import { PusherAuthDto } from "@/modules/pusher/dto/pusher-auth.dto";
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { HttpRequest as Request } from '@/common/types/http.type';
import { PusherService } from '../service/pusher.service';

@ApiTags('Pusher')
@ApiBearerAuth('bearer')
@Controller('pusher')
export class PusherController {
  constructor(private readonly pusherService: PusherService) {}

  @Post('auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authorize a private Pusher channel' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Channel authorized' })
  @ApiResponse({ status: 400, description: 'Invalid channel request' })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'Unsupported private channel' })
  async authorizeChannel(@Req() req: Request, @Body() body: PusherAuthDto) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();

    const { channel_name: channelName, socket_id: socketId } = body;
    if (!channelName.startsWith("private-")) {
      throw new BadRequestException("Only private channels are supported");
    }

    const supportedChannels = [
      pusherChannel.privateNotification(userId),
      pusherChannel.privateReport(userId),
      pusherChannel.privateUser(userId),
    ];
    if (supportedChannels.includes(channelName)) {
      return this.pusherService.authorizeChannel(socketId, channelName);
    }
    throw new ForbiddenException("Unsupported private channel");
  }
}
