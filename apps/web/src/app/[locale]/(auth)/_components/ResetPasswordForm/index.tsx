import { FormMessageI18n } from "@/app/[locale]/(main)/_components/common/FormMessageI18n";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounceInput } from "@/hooks/use-debouce-input";
import { useLocale, useTranslations } from "next-intl";
import {
  ResetPasswordSchemaBody,
  type ResetPasswordSchemaBodyType,
} from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ResetPasswordFormProps {
  isLoading: boolean;
  onResetPassword: (values: ResetPasswordSchemaBodyType) => void;
  token: string;
}

export const ResetPasswordForm = ({
  isLoading,
  onResetPassword,
  token,
}: ResetPasswordFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const form = useForm<ResetPasswordSchemaBodyType>({
    resolver: zodResolver(ResetPasswordSchemaBody),
    mode: "onSubmit",
    defaultValues: {
      token,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useDebounceInput<ResetPasswordSchemaBodyType>({ form });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-semibold mb-6 text-foreground">
        {t("auth.resetPasswordTitle")}
      </h1>

      <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
        {t("auth.resetPasswordDescription")}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onResetPassword)}
          className="space-y-4 flex flex-col items-center w-full max-w-sm"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <Input
                  disabled={isLoading}
                  type="email"
                  placeholder={t("auth.email")}
                  {...field}
                />
                <FormMessageI18n />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <Input
                  disabled={isLoading}
                  type="password"
                  placeholder={t("auth.newPassword")}
                  {...field}
                />
                <FormMessageI18n />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <Input
                  disabled={isLoading}
                  type="password"
                  placeholder={t("auth.confirmPassword")}
                  {...field}
                />
                <FormMessageI18n />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold"
          >
            {isLoading ? t("auth.loading") : t("auth.resetPassword")}
          </Button>

          <p
            onClick={() => router.replace(`/${locale}/login`)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 block text-center cursor-pointer"
          >
            {t("auth.backToLogin")}
          </p>
        </form>
      </Form>
    </div>
  );
};
