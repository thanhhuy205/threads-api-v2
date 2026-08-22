import { PERMISSIONS } from "@/common/constants/permission.constant";
import { ABILITY_SERVICE, type AbilityService } from "@api/modules/ability/service/ability.service";
import type { CreatePostCommand } from "@api/modules/post/command/create-post.command";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
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
