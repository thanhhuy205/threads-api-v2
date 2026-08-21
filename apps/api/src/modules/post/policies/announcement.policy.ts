import { PERMISSIONS } from "@api/common/constants/permission.constant";
import { AccessControlService } from "@api/modules/access-control/services/access-control.service";
import type { CreatePostCommand } from "@api/modules/post/command/create-post.command";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PostType, VisibilityPost } from "@prisma/client";

@Injectable()
export class AnnouncementPolicy implements PostCreationPolicy {
    constructor(private readonly accessControlService: AccessControlService) { }

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
        await this.accessControlService.assertPermission(
            payload.userId,
            PERMISSIONS.ANNOUNCEMENT_CREATE,
        );
    }

}
