"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function VerifyEmailToastHandlerInner() {
  const searchParams = useSearchParams();
  const t = useTranslations();

  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    if (verified === "1") {
      toast.success(t("auth.verifySuccess"));
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    } else if (error === "verify-failed") {
      toast.error(t("auth.verifyFailed"));
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, t]);

  return null;
}

export function VerifyEmailToastHandler() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailToastHandlerInner />
    </Suspense>
  );
}
