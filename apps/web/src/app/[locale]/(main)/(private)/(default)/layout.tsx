import LayoutClient from "@/app/[locale]/(main)/(default)/layout.client";
import type { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutClient>{children}</LayoutClient>;
}
