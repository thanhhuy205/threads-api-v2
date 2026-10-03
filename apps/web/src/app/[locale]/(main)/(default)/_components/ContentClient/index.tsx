"use client";

import Column from "@/app/[locale]/(main)/(default)/_components/Column";
import { normalizePathname } from "@/utils/normalize-pathname";
import { usePathname } from "next/navigation";

export default function ColumnClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawPathname = usePathname();
  const pathname = normalizePathname(rawPathname);

  return <Column pathName={pathname}>{children}</Column>;
}
