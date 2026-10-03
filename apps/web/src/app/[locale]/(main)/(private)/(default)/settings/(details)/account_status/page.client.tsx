"use client";

import CheckboxMenuItem from "@/app/[locale]/(main)/(private)/(default)/settings/(details)/_components/ItemSetting/CheckMenuItem";
import AvatarGroup from "@/app/[locale]/(main)/_components/common/AvatarGroup";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks";
import { useTranslations } from "next-intl";

const AccountStatusClient = () => {
  const t = useTranslations();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card className="p-0 border-0 shadow-none gap-1 bg-primary-foreground">
      <div className="flex items-center gap-5 mb-4">
        <AvatarGroup
          size={12}
          url={user.avatar || ""}
          fallBack={user.username?.slice(0, 2).toUpperCase()}
        />

        <div>
          <div className="font-semibold">{`@${user.username}@pulseboard.net`}</div>
          <div className="text-sm text-gray-600">{user.name}</div>
        </div>
      </div>

      <h3 className="font-semibold mb-1">{t("accountStatus.actionsTaken")}</h3>

      <p className="text-sm text-gray-500 mb-2">
        {t("accountStatus.description")}{" "}
        <span className="text-blue-600">{t("accountStatus.learnMore")}</span>
      </p>

      <div className="space-y-1">
        <CheckboxMenuItem
          text={t("accountStatus.removedContent")}
          checked={true}
        />
        <CheckboxMenuItem
          text={t("accountStatus.disabledFeatures")}
          checked={true}
        />
      </div>
    </Card>
  );
};

export default AccountStatusClient;
