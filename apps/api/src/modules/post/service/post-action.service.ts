import type { UpdatePostDto } from '../dto/request';
import type { PostRecord } from '../repository/post.repository';
export const POST_ACTION_SERVICE = Symbol('POST_ACTION_SERVICE');
export interface PostActionService {
  hide(publicId: string, userId: string, isHidden: boolean): Promise<void>;
  actionAdmin(publicId: string): Promise<void>;
  save(publicId: string, userId: string, isSaved: boolean): Promise<void>;
  like(publicId: string, userId: string): Promise<number>;
  delete(publicId: string, userId: string): Promise<void>;
  update(publicId: string, userId: string, payload: UpdatePostDto): Promise<PostRecord>;
}
