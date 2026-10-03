import DefaultRoutesLayoutClient from "@/app/[locale]/(main)/(default)/layout.client";
import type { ReactNode } from "react";

export default function PrivateDefaultRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DefaultRoutesLayoutClient>{children}</DefaultRoutesLayoutClient>;
}
