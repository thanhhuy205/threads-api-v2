import type { ReactNode } from "react";
import DefaultRoutesLayoutClient from "./layout.client";

export default function DefaultRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DefaultRoutesLayoutClient>{children}</DefaultRoutesLayoutClient>;
}
