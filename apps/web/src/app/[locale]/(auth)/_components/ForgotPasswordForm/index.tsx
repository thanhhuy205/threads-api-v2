import { FormMessageI18n } from "@/app/[locale]/(main)/_components/common/FormMessageI18n";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounceInput } from "@/hooks/use-debouce-input";
import { useLocale, useTranslations } from "next-intl";
import {
  ForgotPasswordSchemaBody,
  type ForgotPasswordSchemaBodyType,
} from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface ForgotPasswordFormProps {
  isLoading: boolean;
  onForgotPassword: (values: ForgotPasswordSchemaBodyType) => void;
}

export const ForgotPasswordForm = ({
  isLoading,
  onForgotPassword,
}: ForgotPasswordFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaBodyType>({
    resolver: zodResolver(ForgotPasswordSchemaBody),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  useDebounceInput<ForgotPasswordSchemaBodyType>({ form });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {t("auth.forgotPasswordTitle")}
      </h1>

      <p className="mb-7 mt-2 text-sm leading-6 text-muted-foreground">
        {t("auth.forgotPasswordDescription")}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onForgotPassword)}
          className="flex w-full flex-col space-y-4"
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
                  placeholder={t("auth.emailPlaceholder")}
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
            {isLoading
              ? t("auth.loadingSendResetLink")
              : t("auth.sendResetLink")}
          </Button>

          <p
            onClick={() => router.replace(`/${locale}/login`)}
            className="mt-2 block text-center text-sm font-medium text-primary hover:opacity-70 cursor-pointer"
          >
            {t("auth.backToLogin")}
          </p>
        </form>
      </Form>
    </div>
  );
};
