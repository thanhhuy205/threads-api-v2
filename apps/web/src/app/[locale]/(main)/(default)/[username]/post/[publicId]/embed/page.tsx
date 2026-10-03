import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed Post",
  description: "Embedded post view.",
};

const EmbedPage = () => {
  return <div className="p-4">Embed Page</div>;
};

export default EmbedPage;
