import { PERMISSIONS } from "@api/common/constants/permission.constant";
import { AccessControlService } from "@api/modules/access-control/services/access-control.service";
import { CreatePostPayload } from "@api/modules/post/interfaces/create-post-payload";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PostType, VisibilityPost } from "@prisma/client";

@Injectable()
export class AnnouncementPolicy implements PostCreationPolicy {
    constructor(private readonly accessControlService: AccessControlService) { }

    applies(payload: CreatePostPayload): boolean {
        return payload.type === PostType.ANNOUNCEMENT;
    }

    async enforce(payload: CreatePostPayload): Promise<void> {
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