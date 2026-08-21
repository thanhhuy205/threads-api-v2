import { PERMISSIONS } from "@api/common/constants/permission.constant";
import { AccessControlService } from "@api/modules/access-control/services/access-control.service";
import type { CreatePostCommand } from "@api/modules/post/command/create-post.command";
import { PostCreationContext } from "@api/modules/post/context/post-creation-context";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ExpirationPolicy implements PostCreationPolicy {
    constructor(private readonly accessControlService: AccessControlService) { }

    applies(payload: CreatePostCommand): boolean {
        return payload.dateRangeFrom !== undefined && payload.dateRangeTo !== undefined;
    }

    async enforce(
        payload: CreatePostCommand,
        ctx: PostCreationContext,
    ): Promise<void> {
        if (payload.dateRangeFrom!.getTime() < Date.now()) {
            throw new BadRequestException('dateRangeFrom must be in the future');
        }
        await this.accessControlService.assertPermission(
            payload.userId,
            PERMISSIONS.POST_EXPIRE,
            ctx.scope,
        );
    }

}
