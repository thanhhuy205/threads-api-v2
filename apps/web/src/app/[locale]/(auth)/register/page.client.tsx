"use client";

import { RegisterForm } from "@/app/[locale]/(auth)/_components/RegisterForm";
import { useRegisterMutation } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store/auth-store";
import type { RegisterSchemaBodyType } from "@/schema/auth.schema";
import { useLocale } from "next-intl";
import { toast } from "sonner";

export default function RegisterPageClient() {
  const { mutateAsync: register, isPending } = useRegisterMutation();
  const setUser = useAuthStore((state) => state.setUser);
  const locale = useLocale();

  const handleRegister = async (values: RegisterSchemaBodyType) => {
    const result = await toast
      .promise(register(values), {
        loading: "Registering...",
        success: "Registration successful!",
        error: "Registration failed.",
      })
      .unwrap();
    if (result.success) {
      setUser(result.data as any);
      window.location.replace(`/${locale}/`);
    }
  };

  return <RegisterForm isLoading={isPending} onRegister={handleRegister} />;
}
