import type { Metadata } from "next";
import ExternalLinkItem from "@/app/[locale]/(main)/(private)/(default)/settings/(details)/_components/ItemSetting/ExternalLinkItem";
import MenuItem from "@/app/[locale]/(main)/(private)/(default)/settings/(details)/_components/MenuItem";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Settings · Account",
  description: "Manage your account settings.",
};

const Account = () => {
  const t = useTranslations();
  return (
    <div className="space-y-5">
      {/* Group 1 */}
      <div className="rounded-2xl bg-card overflow-hidden">
        <MenuItem text={t("account.sensitiveContent")} />
        <Separator />
        <MenuItem text={t("account.politicalContent")} />
        <Separator />
        <MenuItem text={t("account.sitePermissions")} />
        <Separator />
        <MenuItem text={t("account.disableOrDeleteProfile")} />
        <Separator />
        <MenuItem
          text={t("account.shareToFediverse")}
          badge={
            <Badge variant="outline" className="text-xs font-semibold rounded-full px-2">
              {t("common.beta")}
            </Badge>
          }
        />
      </div>

      {/* Group 2 */}
      <div className="rounded-2xl bg-card overflow-hidden">
        <div className="px-5 py-4">
          <h3 className="font-semibold text-base">{t("account.otherAccountSettings")}</h3>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">
            {t("account.sharedSettingsDescription")}
          </p>
        </div>
        <Separator />
        <ExternalLinkItem text={t("account.personalInfo")} />
        <Separator />
        <ExternalLinkItem text={t("account.security")} />
        <Separator />
        <ExternalLinkItem text={t("account.downloadYourInfo")} />
        <Separator />
        <ExternalLinkItem text={t("account.transferYourInfo")} />
      </div>
    </div>
  );
};

export default Account;
