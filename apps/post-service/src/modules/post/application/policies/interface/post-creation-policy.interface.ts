import type { CreatePostCommand } from '../../commands/create-post.command';


interface PostCreationContext {

}

export interface PostCreationPolicy {
    applies(payload: CreatePostCommand): boolean;

    enforce(
        payload: CreatePostCommand,
        ctx: PostCreationContext,
    ): Promise<void>;
}

export const POST_CREATION_POLICIES = Symbol('POST_CREATION_POLICIES');
