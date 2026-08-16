import { GetUserId } from '@/common/decorators/get-user-id.decorator';
import { BadRequestException, ForbiddenException } from "@/errors/error";
import { pusherChannel } from "@/modules/pusher/channel/pusher-channel";
import { PusherAuthDto } from "@/modules/pusher/dto/pusher-auth.dto";
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async authorizeChannel(
    @GetUserId() userId: string,
    @Body() body: PusherAuthDto,
  ) {
    const { channel_name: channelName, socket_id: socketId } = body;
    if (!channelName.startsWith("private-")) {
      throw new BadRequestException("Only private channels are supported");
    }

    const supportedChannels = [
      pusherChannel.privateNotification(userId),
      pusherChannel.privateUser(userId),
    ];
    if (supportedChannels.includes(channelName)) {
      return this.pusherService.authorizeChannel(socketId, channelName);
    }
    throw new ForbiddenException("Unsupported private channel");
  }
}
