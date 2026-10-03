import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { EyeOff, Heart, Lock, Shield, User, Users, UserX } from "lucide-react";
import MenuItem from "../_components/MenuItem";

export const metadata: Metadata = {
  title: "Settings · Privacy",
  description: "Control your privacy settings and preferences.",
};

const PrivacyPage = () => {
  const t = useTranslations();
  return (
    <div className="rounded-2xl bg-card overflow-hidden">
      <MenuItem icon={<Lock className="w-5 h-5" />} text={t("privacy.privateProfile")} hasArrow />
      <Separator />
      <MenuItem icon={<Shield className="w-5 h-5" />} text={t("privacy.tagAndMention")} hasArrow />
      <Separator />
      <MenuItem icon={<User className="w-5 h-5" />} text={t("privacy.onlineStatus")} hasArrow />
      <Separator />
      <MenuItem icon={<Users className="w-5 h-5" />} text={t("privacy.restrictedProfiles")} hasArrow />
      <Separator />
      <MenuItem icon={<UserX className="w-5 h-5" />} text={t("privacy.blockedProfiles")} hasArrow />
      <Separator />
      <MenuItem icon={<EyeOff className="w-5 h-5" />} text={t("privacy.mutedWords")} hasArrow />
      <Separator />
      <MenuItem icon={<Heart className="w-5 h-5" />} text={t("privacy.hideLikesAndShares")} hasArrow />
    </div>
  );
};

export default PrivacyPage;
