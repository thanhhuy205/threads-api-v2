import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import SwiperImage from "@/app/[locale]/(main)/_components/common/SwiperImage";
import { useRouter } from "next/navigation";
import type { MappedPost } from "../type";

const Quote = ({
  post,
  mode = "default",
}: {
  post: NonNullable<MappedPost["originalPost"]>;
  mode: "default" | "static" | "detail";
}) => {
  const router = useRouter();

  if (!post.user || post.user.username === "unknown") return null;

  const wrapperClass =
    mode === "static" || mode === "detail"
      ? "mt-3 border rounded-xl bg-muted/30 py-3 px-0 ml-0"
      : "mt-3 ml-[58px] border rounded-xl bg-muted/30 p-3";

  return (
    <div
      data-set-quote="true"
      onClick={
        mode === "static"
          ? undefined
          : () =>
            router.push(`/post/${post.id}?fromQuote=1&loading=1`)
      }
      className={wrapperClass}
      style={{
        cursor: mode === "static" ? "default" : "pointer",
      }}
    >
      <div className="flex items-center gap-2 px-3">
        <AvatarGroup
          size={8}
          url={post.user?.avatarUrl ?? ""}
          fallBack={post.user.username.slice(0, 2).toUpperCase()}
        />

        <span className="font-semibold text-sm">{post.user.username}</span>

        <span className="text-xs text-muted-foreground">
          {post.createdAt}
        </span>
      </div>

      {post.content && (
        <p className="text-sm mt-2 text-foreground leading-relaxed px-3">
          {post.content}
        </p>
      )}

      {post?.mediaUrls?.length > 0 && (
        <div className="mt-3 px-3">
          <SwiperImage images={post.mediaUrls} />
        </div>
      )}
    </div>
  );
};

export default Quote;
