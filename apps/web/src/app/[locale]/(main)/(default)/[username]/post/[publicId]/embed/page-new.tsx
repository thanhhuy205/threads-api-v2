"use client";

import ThreadIconSmall from "@/app/[locale]/(main)/_components/common/Icon/TheardIconSmall";
import LoadingFetch from "@/app/[locale]/(main)/_components/common/LoadingFetch";
import PostCard from "@/app/[locale]/(main)/_components/post/PostCard";
import { useGetSinglePostQuery } from "@/features/post/api";
import { mapPost } from "@/features/post/map";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { configService } from "@/config";

const NotFound = () => {
  const t = useTranslations();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-lg mb-2 text-center font-bold w-[400px]">
        {t("notFound.title")}
      </h2>

      <p className="text-[14px] text-muted-foreground max-w-[360px] mb-8">
        {t("notFound.description")}
      </p>

      <button className="px-6 rounded-lg" onClick={() => window.history.back()}>
        {t("notFound.back")}
      </button>
    </div>
  );
};

export default function MainEmbedPage() {
  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const postId = String(id);
  const t = useTranslations();

  const {
    data: response,
    isLoading: loadingRequest,
    isError: error,
  } = useGetSinglePostQuery(postId, { enabled: Boolean(postId) });
  const singlePost = response?.data;

  if (!id || error) return <NotFound />;
  if (loadingRequest || !singlePost || singlePost.publicId !== postId)
    return <LoadingFetch />;

  return (
    <>
      <PostCard post={mapPost(singlePost)} mode="static" />

      <a
        href={`${configService.nextPublicBaseUrl}/post/${singlePost.publicId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          absolute bottom-4 right-4
          flex items-center gap-2
          px-4 py-2 bg-gray-100 
          rounded-lg shadow-sm
          text-sm font-medium
          hover:bg-gray-200 transition
          translate-y-1/4
        "
      >
        {t("embed.viewOnThreads")}
        <div className="size-5">
          <ThreadIconSmall />
        </div>
      </a>
    </>
  );
}
