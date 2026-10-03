import {
  getSearchPostsServer,
  getSearchUsernameServer,
} from "@/features/search/api/server";
import type {
  SearchPostsResponse,
  SearchUsernameResponse,
} from "@/types/search";
import type { Metadata } from "next";
import SearchPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Search",
  description: "Search for posts and profiles.",
};

type SearchPageProps = {
  searchParams?: Promise<{
    filter?: string | string[];
    q?: string | string[];
  }>;
};

const firstParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

export default async function SearchPageRoute({
  searchParams,
}: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const q = firstParam(resolvedSearchParams?.q)?.trim() ?? "";
  const filter = firstParam(resolvedSearchParams?.filter);
  const isProfilesTab = filter === "profiles";
  let initialPosts: SearchPostsResponse | null = null;
  let initialProfiles: SearchUsernameResponse | null = null;

  if (q && isProfilesTab) {
    initialProfiles = await getSearchUsernameServer({ q });
  } else if (q) {
    initialPosts = await getSearchPostsServer({ q, serp_type: "default" });
  }

  return (
    <SearchPageClient
      initialPosts={initialPosts}
      initialProfiles={initialProfiles}
    />
  );
}
