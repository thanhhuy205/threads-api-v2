import { FormMessageI18n } from "@/app/[locale]/(main)/_components/common/FormMessageI18n";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDebounceInput } from "@/hooks/use-debouce-input";
import {
  LoginSchemaBody,
  type LoginSchemaBodyType,
} from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface LoginFormProps {
  isLoading: boolean;
  onLogin: (values: LoginSchemaBodyType) => Promise<void>;
}

const demoAccounts = [
  { key: "ceo", label: "CEO", email: "ceo@company.local" },
  { key: "hr", label: "HR", email: "hr@company.local" },
  { key: "cto", label: "CTO", email: "cto@company.local" },
  { key: "techLead", label: "Tech Lead", email: "techlead@company.local" },
  { key: "seniorDeveloper", label: "Senior Dev", email: "senior.dev@company.local" },
  { key: "developer", label: "Developer", email: "developer@company.local" },
  { key: "internDeveloper", label: "Intern Dev", email: "intern.dev@company.local" },
  { key: "employee", label: "Employee", email: "employee@company.local" },
] as const;

const LoginForm = ({ isLoading, onLogin }: LoginFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const form = useForm<LoginSchemaBodyType>({
    resolver: zodResolver(LoginSchemaBody),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  useDebounceInput<LoginSchemaBodyType>({ form });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLogin)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="mb-2">
          <p className="text-2xl font-semibold tracking-tight">Welcome back</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to your company workspace.</p>
        </div>
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                disabled={isLoading}
                placeholder={t("auth.usernamePlaceholder")}
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
                placeholder={t("auth.passwordPlaceholder")}
                {...field}
              />
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <Button
          disabled={isLoading}
          type="submit"
          className="mt-1 h-11 w-full rounded-xl font-semibold"
        >
          {isLoading ? t("auth.loggingIn") : t("auth.login")}
        </Button>

        {/* Forgot password */}
        <p
          onClick={() => router.replace(`/${locale}/forgot-password`)}
          className="text-left text-sm font-medium text-primary hover:opacity-70"
        >
          {t("auth.forgotPassword")}
        </p>

        {/* Register */}
        <p
          onClick={() => router.replace(`/${locale}/register`)}
          className="mt-2 text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {t("auth.dontHaveAccount")} <span className="font-bold">{t("auth.register")}</span>
        </p>

        <div className="mt-2 border-t border-slate-200 pt-5 dark:border-white/10">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick demo access</p>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.key}
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  form.reset({
                    login: account.email,
                    password: "12345678",
                  })
                }
                className="h-auto min-w-0 justify-start gap-2 rounded-xl px-3 py-2.5 text-left dark:border-white/10 dark:hover:border-white/20"
              >
                <BriefcaseBusiness className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">
                    {account.label}
                  </span>
                  <span className="block truncate text-[10px] font-normal text-muted-foreground">
                    {account.email}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
