import type { Metadata } from "next";
import GrowthPageClient from "./page.client";

export const metadata: Metadata = {
  title: "Lịch trưởng thành",
  description: "Theo dõi milestone và kỹ năng trong lộ trình phát triển.",
};

export default function GrowthPage() {
  return <GrowthPageClient />;
}
