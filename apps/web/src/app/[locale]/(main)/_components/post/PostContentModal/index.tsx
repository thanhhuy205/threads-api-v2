import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import Footer from "@/app/[locale]/(main)/_components/common/ModalPopup/Footer";
import Header from "@/app/[locale]/(main)/_components/common/ModalPopup/Header";
import UserAction from "@/app/[locale]/(main)/_components/user/UserAction";
import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@/types/user";
import { useState, type Dispatch, type SetStateAction } from "react";
import PostCard from "../PostCard";
import type { MappedPost } from "../type";

export interface PostSubmitPayload {
  previewImage: File[] | null;
}

interface PostContentModalProps {
  title: string;
  post: MappedPost;
  user: User;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  onSubmit: (payload: PostSubmitPayload) => void;
  loading: boolean;
  loadingLabel: string;
  submitLabel: string;
  addToThreadText: string;
  onClose: () => void;
  mode: "quote" | "reply";
}

const PostContentModal = ({
  title,
  post,
  user,
  content,
  setContent,
  onSubmit,
  loading,
  loadingLabel,
  submitLabel,
  addToThreadText,
  onClose,
  mode = "reply",
}: PostContentModalProps) => {
  const [previewImage, setPreviewImage] = useState<File[] | null>(null);

  return (
    <Card className="p-0 gap-0" onClick={(e) => e.stopPropagation()}>
      <Header headerText={title} onClose={onClose} />

      <CardContent className="p-4 pt-5">
        {mode !== "quote" && <PostCard post={post} mode="reply" />}

        <div className="flex gap-3 mt-5">
          <div className="flex flex-col items-center">
            <AvatarGroup
              size={10}
              url={user?.avatar ?? ""}
              fallBack={user?.username?.slice(0, 2).toUpperCase()}
              classNameFallback="w-10 h-10"
              className="w-10 h-10"
            />

            <div className="w-[2px] flex-1 bg-border my-2 rounded-full" />

            <AvatarGroup
              size={10}
              url={user?.avatar ?? ""}
              fallBack={user?.username?.slice(0, 2).toUpperCase()}
              classNameFallback="w-10 h-10"
              className="w-10 h-10"
            />
          </div>

          <div className="flex-1 space-y-4 pt-1">
            <UserAction
              username={user.username}
              onChangeContent={(data) => {
                setContent(data.content);
                setPreviewImage(data.previewImage);
              }}
            />

            {mode === "quote" && (
              <div className="border p-2 rounded-xl">
                <PostCard post={post} mode="reply" />
              </div>
            )}

            <div className="text-muted-foreground/50 text-sm pt-3">
              {addToThreadText}
            </div>
          </div>
        </div>
      </CardContent>

      <Footer
        loading={loading}
        loadingLabel={loadingLabel}
        label={submitLabel}
        content={content}
        onSubmit={() => onSubmit({ previewImage })}
      />
    </Card>
  );
};

export default PostContentModal;
