import { createContext } from "react";
import type { MappedPost } from "../type";

export const PostContext = createContext<{
  post: MappedPost;
} | null>(null);

const PostProvider = ({
  children,
  post,
}: {
  children: React.ReactNode;
  post: MappedPost;
}) => {
  return (
    <PostContext.Provider value={{ post }}>{children}</PostContext.Provider>
  );
};

export default PostProvider;
