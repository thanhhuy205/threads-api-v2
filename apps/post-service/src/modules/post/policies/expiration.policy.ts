import { Inject, Injectable } from "@nestjs/common";
import type { CreatePostCommand } from "@post-service/modules/post/command/create-post.command";
import { PostCreationPolicy } from "@post-service/modules/post/policies/interface/post-creation-policy.interface";
import { ABILITY_SERVICE, type AbilityService } from "@workspace-service/modules/ability/ability.service";

@Injectable()
export class ExpirationPolicy implements PostCreationPolicy {
    constructor(@Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService) { }
    enforce(payload: CreatePostCommand, ctx: PostCreationContext): Promise<void> {
        throw new Error("Method not implemented.");
    }

    applies(payload: CreatePostCommand): boolean {
        return (
            payload.dateRangeFrom !== undefined ||
            payload.dateRangeTo !== undefined ||
            payload.scheduledTimeFrom !== undefined ||
            payload.scheduledTimeTo !== undefined
        );
    }

    // async enforce(
    //     payload: CreatePostCommand,
    //     ctx: PostCreationContext,
    // ): Promise<void> {
    //     if (
    //         payload.dateRangeFrom !== undefined &&
    //         payload.dateRangeFrom !== null &&
    //         payload.dateRangeFrom.getTime() < Date.now()
    //     ) {
    //         throw new BadRequestException('dateRangeFrom must be in the future');
    //     }
    //     await this.abilityService.assertCan(
    //         payload.userId,
    //         PERMISSIONS.POST_EXPIRE,
    //         ctx.scope,
    //     );
    // }

}
