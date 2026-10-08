import type { InteractionType } from '@purse/common/enums';

export type PostInteractionCommand = {
  userId: string;
  postId: number;
  type: InteractionType;
};
