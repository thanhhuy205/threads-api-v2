import { usePostThreadMutation } from "@/features/post/api";
import { useUploadMediaMutation } from "@/features/upload";
import { createPostSchema } from "@/schema/post.schema";
import {
  PostType,
  ReplyPermission,
  VisibilityPost,
  type MentionInput,
  type PostMediaInput,
  type PostTypeStatus,
  type ScheduleDateRange,
} from "@/types/post";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

const useCreatePost = (onSuccess?: () => void) => {
  const t = useTranslations();
  const { mutateAsync: postThread, isPending: loadingPosts } =
    usePostThreadMutation();

  const { mutateAsync: uploadMedia } = useUploadMediaMutation();

  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [mentions, setMentions] = useState<MentionInput[]>([]);
  const [previewImage, setPreviewImage] = useState<File[] | null>(null);
  const [postType, setPostType] = useState<PostTypeStatus>(PostType.POST);
  const [visibility, setVisibility] = useState<VisibilityPost>(
    VisibilityPost.WORKSPACE,
  );
  const [replyPermission, setReplyPermission] = useState<ReplyPermission>(
    ReplyPermission.EVERYONE,
  );
  const [scheduledDate, setScheduledDate] = useState<
    ScheduleDateRange | undefined
  >(
    undefined,
  );
  const [scheduledTimeFrom, setScheduledTimeFrom] = useState<string | undefined>(
    undefined,
  );
  const [scheduledTimeTo, setScheduledTimeTo] = useState<string | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    const trimmedContent = content.trim();
    const trimmedTopic = topic.trim();

    const result = createPostSchema.safeParse({
      content: trimmedContent,
      media: previewImage || [],
      topic: trimmedTopic || undefined,
      mentions: mentions.length ? mentions : undefined,
      visibility,
      replyPermission,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message || t("toast.postError"));
      return;
    }

    setIsSubmitting(true);

    try {
      await toast.promise(
        (async () => {
          let medias: PostMediaInput[] = [];
          if (previewImage?.length) {
            const uploadedMedia = await uploadMedia(previewImage);
            medias = uploadedMedia.data.medias;
          }
          await postThread({
            content: trimmedContent,
            topic: trimmedTopic || undefined,
            mentions: mentions.length ? mentions : undefined,
            media: medias,
            type: postType,
            visibility,
            replyPermission,
            dateRangeFrom:
              postType === PostType.ANNOUNCEMENT
                ? scheduledDate?.from
                : undefined,
            dateRangeTo:
              postType === PostType.ANNOUNCEMENT
                ? scheduledDate?.to
                : undefined,
            scheduledTimeFrom:
              postType === PostType.ANNOUNCEMENT
                ? scheduledTimeFrom
                : undefined,
            scheduledTimeTo:
              postType === PostType.ANNOUNCEMENT
                ? scheduledTimeTo
                : undefined,
          });
        })(),
        {
          loading: t("toast.posting"),
          success: t("toast.postSuccess"),
          error: t("toast.postError"),
        },
      );

      if (onSuccess) onSuccess();

      setContent("");
      setTopic("");
      setMentions([]);
      setPreviewImage(null);
      setPostType(PostType.POST);
      setVisibility(VisibilityPost.WORKSPACE);
      setReplyPermission(ReplyPermission.EVERYONE);
      setScheduledDate(undefined);
      setScheduledTimeFrom(undefined);
      setScheduledTimeTo(undefined);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    topic,
    mentions,
    setContent,
    setTopic,
    setMentions,
    previewImage,
    setPreviewImage,
    postType,
    setPostType,
    visibility,
    setVisibility,
    replyPermission,
    setReplyPermission,
    scheduledDate,
    setScheduledDate,
    scheduledTimeFrom,
    setScheduledTimeFrom,
    scheduledTimeTo,
    setScheduledTimeTo,
    loadingPosts: loadingPosts || isSubmitting,
    handlePost,
  };
};
export { useCreatePost };

