import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import ExternalLinkItem from "../_components/ItemSetting/ExternalLinkItem";
import MenuItem from "../_components/MenuItem";

export const metadata: Metadata = {
  title: "Settings · Help",
  description: "Get help and access support resources.",
};

export default function PrivateSettingsHelpPage() {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      {/* Group 1 */}
      <div className="rounded-2xl bg-card overflow-hidden">
        <MenuItem text={t("help.securityAndPrivacyHelp")} />
        <Separator />
        <MenuItem text={t("help.requestSupport")} />
      </div>

      {/* Group 2 */}
      <div className="rounded-2xl bg-card overflow-hidden">
        <ExternalLinkItem text={t("help.helpCenter")} />
        <Separator />
        <ExternalLinkItem text={t("help.metaPrivacyPolicy")} />
        <Separator />
        <ExternalLinkItem text={t("help.metaTerms")} />
        <Separator />
        <ExternalLinkItem text={t("help.threadsAdditionalPrivacy")} />
        <Separator />
        <ExternalLinkItem text={t("help.threadsTerms")} />
        <Separator />
        <ExternalLinkItem text={t("help.cookiePolicy")} />
        <Separator />
        <ExternalLinkItem text={t("help.fediverseGuidelines")} />
      </div>
    </div>
  );
}
