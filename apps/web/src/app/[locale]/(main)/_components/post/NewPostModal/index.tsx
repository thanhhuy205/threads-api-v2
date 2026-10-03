import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import Footer from "@/app/[locale]/(main)/_components/common/ModalPopup/Footer";
import Header from "@/app/[locale]/(main)/_components/common/ModalPopup/Header";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { useCreatePost } from "@/hooks/use-create-post";
import { useTranslations } from "next-intl";
import UserPostForm from "../../user/UserPostForm";

function NewPostModal({
  onClose,
  mode = "auto",
}: {
  onClose: () => void;
  mode?: "subtract" | "auto";
}) {
  const t = useTranslations();
  const { user } = useAuth();

  const {
    content,
    setContent,
    setTopic,
    setMentions,
    setPreviewImage,
    setPostType,
    visibility,
    setVisibility,
    replyPermission,
    setReplyPermission,
    loadingPosts,
    handlePost,
    setScheduledDate,
    setScheduledTimeFrom,
    setScheduledTimeTo,
  } = useCreatePost(onClose);

  if (!user) return null;

  return (
    <ModalPopup
      mode={mode}
      onClose={loadingPosts ? () => {} : onClose}
      closeOnBackdropClick={!loadingPosts}>
      <Card className="gap-0 p-0" onClick={(e) => e.stopPropagation()}>
        <Header
          headerText={t("post.newThread")}
          onClose={loadingPosts ? () => {} : onClose}
          visibility={visibility}
          onVisibilityChange={setVisibility}
        />

        <UserPostForm
          user={user}
          setContent={setContent}
          setTopic={setTopic}
          setMentions={setMentions}
          setPreviewImage={setPreviewImage}
          setPostType={setPostType}
          setScheduledDate={setScheduledDate}
          setScheduledTimeFrom={setScheduledTimeFrom}
          setScheduledTimeTo={setScheduledTimeTo}
          t={t}
        />

        <Footer
          content={content}
          loading={loadingPosts}
          loadingLabel={t("toast.posting") || "Đang đăng..."}
          onSubmit={handlePost}
          replyPermission={replyPermission}
          onReplyPermissionChange={setReplyPermission}
        />
      </Card>
    </ModalPopup>
  );
}

export default NewPostModal;
