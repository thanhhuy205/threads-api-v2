"use client";

import ModalPopup from "@/app/[locale]/(main)/_components/common/ModalPopup";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSimilarPostsMutation } from "@/features/post/hooks";
import { formatTime } from "@/utils/format-time";

type SimilarPostsTagProps = {
  publicId: string;
  content: string;
  topics: string[];
};

const SimilarPostsTag = ({
  publicId,
  content,
  topics,
}: SimilarPostsTagProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate, data, isPending } = useSimilarPostsMutation(publicId);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
    if (!data) {
      mutate({ content, topic: topics });
    }
  };

  const similarPosts = data?.data || [];

  return (
    <>
      {/* Inline tag trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="
          inline-flex items-center gap-1 px-2 py-0.5
          rounded-full
          border border-amber-300/60 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700/40
          text-amber-600 dark:text-amber-400
          hover:bg-amber-100 dark:hover:bg-amber-900/40
          hover:border-amber-400 dark:hover:border-amber-600
          active:scale-95
          transition-all duration-150 ease-out
          cursor-pointer
          text-[11px] font-medium
          whitespace-nowrap
        "
      >
        <Sparkles className="size-3" />
        Tương tự
      </button>

      {/* Modal */}
      {open && (
        <ModalPopup onClose={() => setOpen(false)} title="Bài viết tương tự">
          <Card className="p-0 gap-0 border-0 shadow-none w-full ">
            <CardContent className="p-0">
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <h2 className="text-base font-semibold text-foreground">
                  Bài viết tương tự
                </h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Gợi ý dựa trên nội dung bài viết
                </p>
              </div>

              <div className="h-px bg-border" />

              {/* Posts list */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {isPending ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : similarPosts.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    Không tìm thấy bài viết tương tự nào.
                  </div>
                ) : (
                  similarPosts.map((post) => (
                    <button
                      key={post.publicId}
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(
                          `/${post.userSnapshot.username}/post/${post.publicId}`,
                        );
                      }}
                      className="
                        group w-full text-left rounded-xl px-4 py-3.5
                        transition-all duration-200 ease-out
                        hover:bg-accent/60
                        active:scale-[0.99]
                      "
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="size-7 rounded-full bg-muted-foreground/15 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {post.userSnapshot.username
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-foreground truncate">
                          {post.userSnapshot.username}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-auto shrink-0">
                          {formatTime(post.createdAt)}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[1.5] text-muted-foreground line-clamp-2 pl-[38px] group-hover:text-foreground/80 transition-colors duration-200">
                        {post.content}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </ModalPopup>
      )}
    </>
  );
};

export default SimilarPostsTag;
