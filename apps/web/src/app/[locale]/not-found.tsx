"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AppNotFoundPage() {
  const t = useTranslations();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-lg mb-2 text-center font-bold w-[400px]">
        {t("notFound.title")}
      </h2>

      <p className="text-[14px] text-muted-foreground max-w-[360px] mb-8">
        {t("notFound.description")}
      </p>

      <Button className="px-6 rounded-lg" onClick={() => window.history.back()}>
        {t("notFound.back")}
      </Button>
    </div>
  );
}
