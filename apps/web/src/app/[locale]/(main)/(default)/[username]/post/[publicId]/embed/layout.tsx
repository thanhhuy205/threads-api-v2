import { type ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
  return <div className="relative p-4 border rounded-xl">{children}</div>;
}
