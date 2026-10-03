import type { Metadata } from "next";
import ProfileMedia from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfileMedia";
import ProfilePageShell from "@/app/[locale]/(main)/(private)/(default)/profile/_components/ProfilePageShell";

export const metadata: Metadata = {
  title: "Profile · Media",
  description: "Your media posts.",
};

export default function PrivateProfileMediaPage() {
  return (
    <ProfilePageShell activeTab="media">
      <ProfileMedia />
    </ProfilePageShell>
  );
}
