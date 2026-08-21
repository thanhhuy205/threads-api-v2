import { PERMISSIONS } from "@api/common/constants/permission.constant";
import { AccessControlService } from "@api/modules/access-control/services/access-control.service";
import type { CreatePostCommand } from "@api/modules/post/command/create-post.command";
import { PostCreationContext } from "@api/modules/post/context/post-creation-context";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PinPolicy implements PostCreationPolicy {
    constructor(private readonly accessControlService: AccessControlService) { }

    async enforce(
        payload: CreatePostCommand,
        ctx: PostCreationContext,
    ): Promise<void> {
        await this.accessControlService.assertPermission(
            payload.userId,
            PERMISSIONS.POST_PIN,
            ctx.scope,
        );
    }

    applies(payload: CreatePostCommand): boolean {
        return !!payload.isPinned;
    }
}
