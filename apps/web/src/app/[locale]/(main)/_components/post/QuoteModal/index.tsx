import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { useAuth } from "@/features/auth/hooks";
import { useQuotePostMutation } from "@/features/post/api";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import "swiper/css";
import PostContentModal, { type PostSubmitPayload } from "../PostContentModal";
import type { MappedPost } from "../type";

function QuoteModal({
  post,
  onClose,
}: {
  post: MappedPost;
  onClose: () => void;
}) {
  const { mutateAsync: quotePost, isPending: loading } = useQuotePostMutation();
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const t = useTranslations();

  const handleQuote = async (_payload: PostSubmitPayload) => {
    if (!content || !post.id) return;

    await toast.promise(
      quotePost({
        publicId: post.id.toString(),
        content,
      }),
      {
        loading: t("post.quoteLoading"),
        success: t("post.quoteSuccess"),
        error: t("common.error"),
      }
    );

    onClose();
    setContent("");
  };

  if (!post || !user) return null;

  return (
    <ModalPopup onClose={onClose}>
      <PostContentModal
        title={t("post.quoteTo")}
        mode="quote"
        post={post}
        user={user}
        content={content}
        setContent={setContent}
        onSubmit={handleQuote}
        loading={loading}
        loadingLabel={t("post.quoteLoading")}
        submitLabel={t("post.quote")}
        addToThreadText={t("post.addToThread")}
        onClose={onClose}
      />
    </ModalPopup>
  );
}

export default QuoteModal;
