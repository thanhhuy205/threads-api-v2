// import { ABILITY_SERVICE, type AbilityService } from "@workspace-service/modules/ability/ability.service";
// import { PERMISSIONS } from '@purse/common/constants';
// import type { CreatePostCommand } from '../command/create-post.command';
// import { PostCreationContext } from '../context/post-creation-context';
// import { PostCreationPolicy } from './interface/post-creation-policy.interface';
// import { Inject, Injectable } from "@nestjs/common";

// @Injectable()
// export class PinPolicy implements PostCreationPolicy {
//     constructor(@Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService) { }

//     async enforce(
//         payload: CreatePostCommand,
//         ctx: PostCreationContext,
//     ): Promise<void> {
//         await this.abilityService.assertCan(
//             payload.userId,
//             PERMISSIONS.POST_PIN,
//             ctx.scope,
//         );
//     }

//     applies(payload: CreatePostCommand): boolean {
//         return !!payload.isPinned;
//     }
// }
