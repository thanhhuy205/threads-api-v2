import type { ReactNode } from "react";
import LayoutClient from "./layout.client";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
