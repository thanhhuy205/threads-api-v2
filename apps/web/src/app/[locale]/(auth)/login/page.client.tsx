"use client";

import LoginForm from "@/app/[locale]/(auth)/_components/LoginForm";
import { useLoginMutation } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { LoginSchemaBodyType } from "@/schema/auth.schema";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

export default function LoginPageClient({ verified }: { verified: boolean }) {
  const t = useTranslations();
  const { mutateAsync: login, isPending } = useLoginMutation();
  const setUser = useAuthStore((state) => state.setUser);
  const locale = useLocale();
  const handleLogin = async (values: LoginSchemaBodyType) => {
    const result = await toast
      .promise(login(values), {
        loading: t("auth.loggingIn"),
        success: t("auth.loginSuccess"),
        error: t("auth.loginFailed"),
      })
      .unwrap();

    if (result.success) {
      setUser(result.data as any);
      window.location.replace(`/${locale}/`);
    }
  };

  return (
    <>
      {verified ? (
        <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          {t("auth.accountVerified")}
        </p>
      ) : null}
      <LoginForm isLoading={isPending} onLogin={handleLogin} />
    </>
  );
}
