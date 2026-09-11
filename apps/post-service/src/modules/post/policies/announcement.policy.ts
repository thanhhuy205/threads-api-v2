import { ABILITY_SERVICE, type AbilityService } from "@workspace-service/modules/ability/ability.service";
import type { CreatePostCommand } from "@post-service/modules/post/command/create-post.command";
import { PostCreationPolicy } from "@post-service/modules/post/policies/interface/post-creation-policy.interface";
import { PERMISSIONS } from "@libs/common/src/constants/permission.constant";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PostType, VisibilityPost } from "../../../../generated/prisma";

@Injectable()
export class AnnouncementPolicy implements PostCreationPolicy {
    constructor(@Inject(ABILITY_SERVICE) private readonly abilityService: AbilityService) { }

    applies(payload: CreatePostCommand): boolean {
        return payload.type === PostType.ANNOUNCEMENT;
    }

    async enforce(payload: CreatePostCommand): Promise<void> {
        const visibility = payload.visibility ?? VisibilityPost.WORKSPACE;

        if (visibility !== VisibilityPost.WORKSPACE) {
            throw new BadRequestException(
                'Announcements can only be published to the workspace',
            );
        }
        await this.abilityService.assertCan(
            payload.userId,
            PERMISSIONS.ANNOUNCEMENT_CREATE,
        );
    }

}
