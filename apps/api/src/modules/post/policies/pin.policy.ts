import { PERMISSIONS } from "@/common/constants/permission.constant";
import { ABILITY_SERVICE, type AbilityService } from "@api/modules/ability/service/ability.service";
import type { CreatePostCommand } from "@api/modules/post/command/create-post.command";
import { PostCreationContext } from "@api/modules/post/context/post-creation-context";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
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
