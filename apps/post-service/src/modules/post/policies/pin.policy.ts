import { ABILITY_SERVICE, type AbilityService } from "@auth-service/modules/ability/service/ability.service";
import type { CreatePostCommand } from "@post-service/modules/post/command/create-post.command";
import { PostCreationContext } from "@post-service/modules/post/context/post-creation-context";
import { PostCreationPolicy } from "@post-service/modules/post/policies/interface/post-creation-policy.interface";
import { PERMISSIONS } from "@libs/common/src/constants/permission.constant";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class PinPolicy implements PostCreationPolicy {
    constructor(@Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService) { }

    async enforce(
        payload: CreatePostCommand,
        ctx: PostCreationContext,
    ): Promise<void> {
        await this.abilityService.assertCan(
            payload.userId,
            PERMISSIONS.POST_PIN,
            ctx.scope,
        );
    }

    applies(payload: CreatePostCommand): boolean {
        return !!payload.isPinned;
    }
}
