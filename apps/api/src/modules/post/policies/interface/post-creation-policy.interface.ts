import { PostCreationContext } from "@api/modules/post/context/post-creation-context";
import { CreatePostPayload } from "@api/modules/post/interfaces/create-post-payload";

export interface PostCreationPolicy {
    applies(payload: CreatePostPayload): boolean;

    enforce(
        payload: CreatePostPayload,
        ctx: PostCreationContext,
    ): Promise<void>;
}

export const POST_CREATION_POLICIES = Symbol('POST_CREATION_POLICIES');