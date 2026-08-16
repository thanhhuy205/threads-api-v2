import { PERMISSIONS } from "@api/common/constants/permission.constant";
import { AccessControlService } from "@api/modules/access-control/services/access-control.service";
import { PostCreationContext } from "@api/modules/post/context/post-creation-context";
import { CreatePostPayload } from "@api/modules/post/interfaces/create-post-payload";
import { PostCreationPolicy } from "@api/modules/post/policies/interface/post-creation-policy.interface";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class ExpirationPolicy implements PostCreationPolicy {
    constructor(private readonly accessControlService: AccessControlService) { }

    applies(payload: CreatePostPayload): boolean {
        return payload.expiresAt !== undefined && payload.expiresAt !== null;
    }

    async enforce(
        payload: CreatePostPayload,
        ctx: PostCreationContext,
    ): Promise<void> {
        if (payload.expiresAt!.getTime() <= Date.now()) {
            throw new BadRequestException('expiresAt must be in the future');
        }
        await this.accessControlService.assertPermission(
            payload.userId,
            PERMISSIONS.POST_EXPIRE,
            ctx.scope,
        );
    }

}