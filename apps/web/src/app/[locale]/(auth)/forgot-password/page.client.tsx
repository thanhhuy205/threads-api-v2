"use client";

import { ForgotPasswordForm } from "@/app/[locale]/(auth)/_components/ForgotPasswordForm";
import { validateEmail } from "@/features/auth/api";
import { useForgotPasswordMutation } from "@/features/auth/hooks";
import type { ForgotPasswordSchemaBodyType } from "@/schema/auth.schema";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function ForgotPasswordPageClient() {
  const { mutateAsync: forgotPassword, isPending } = useForgotPasswordMutation();
  const t = useTranslations();

  const handleForgotPassword = async (values: ForgotPasswordSchemaBodyType) => {
    try {
      const res = await validateEmail(values);

      if (!res.data.available) {
        toast.promise(forgotPassword(values), {
          loading: t("auth.forgotSending"),
          success: t("auth.forgotSuccess"),
          error: t("auth.forgotError"),
        });
      } else {
        toast.error(t("auth.emailNotFound"));
      }
    } catch {
      toast.error(t("auth.unknownError"));
    }
  };

  return (
    <ForgotPasswordForm
      isLoading={isPending}
      onForgotPassword={handleForgotPassword}
    />
  );
}
