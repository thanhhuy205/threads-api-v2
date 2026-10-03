import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { useAuth } from "@/features/auth/hooks";
import { useReplyThreadMutation } from "@/features/post/api";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUploadMediaMutation } from "@/features/upload";
import PostContentModal, { type PostSubmitPayload } from "../PostContentModal";
import type { MappedPost } from "../type";

function ReplyModal({
  post,
  onClose,
}: {
  post: MappedPost;
  onClose: () => void;
}) {
  const { mutateAsync: replyThread, isPending: loading } = useReplyThreadMutation();
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const t = useTranslations();
  const { mutateAsync: uploadImage } = useUploadMediaMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async ({ previewImage }: PostSubmitPayload) => {
    if (!content || !post.id) return;

    setIsSubmitting(true);

    try {
      await toast.promise(
        (async () => {
          const medias =
            previewImage?.length
              ? (await uploadImage(previewImage)).data.medias
              : [];
          await replyThread({
            publicId: post.id,
            payload: {
              content,
              media: medias,
            },
          });
        })(),
        {
          loading: t("post.replyLoading") || "Đang đăng phản hồi...",
          success: t("post.replySuccess") || "Đã phản hồi thành công!",
          error: t("common.error") || "Có lỗi xảy ra",
        }
      );

      onClose();
      setContent("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post || !user) return null;

  const activeLoading = loading || isSubmitting;

  return (
    <ModalPopup onClose={activeLoading ? () => {} : onClose} closeOnBackdropClick={!activeLoading}>
      <PostContentModal
        title={t("post.replyTo")}
        mode="reply"
        post={post}
        user={user}
        content={content}
        setContent={setContent}
        onSubmit={handleReply}
        loading={activeLoading}
        loadingLabel={t("post.replyLoading") || "Đang phản hồi..."}
        submitLabel={t("post.reply")}
        addToThreadText={t("post.addToThread")}
        onClose={activeLoading ? () => {} : onClose}
      />
    </ModalPopup>
  );
}

export default ReplyModal;
