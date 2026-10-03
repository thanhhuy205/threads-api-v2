"use client";

import { ResetPasswordForm } from "@/app/[locale]/(auth)/_components/ResetPasswordForm";
import { useResetPasswordMutation } from "@/features/auth/hooks";
import { useLocale, useTranslations } from "next-intl";
import type { ResetPasswordSchemaBodyType } from "@/schema/auth.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPageClient({
  token,
}: {
  token: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const { mutateAsync: resetPassword, isPending } = useResetPasswordMutation();
  const router = useRouter();

  const handleResetPassword = async (values: ResetPasswordSchemaBodyType) => {
    try {
      toast.promise(resetPassword(values), {
        loading: t("reset.loading"),
        success: t("reset.success"),
        error: t("reset.error"),
      });

      router.replace(`/${locale}/login`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ResetPasswordForm
      isLoading={isPending}
      token={token}
      onResetPassword={handleResetPassword}
    />
  );
}
