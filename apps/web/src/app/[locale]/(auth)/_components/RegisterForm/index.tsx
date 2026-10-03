import { FormMessageI18n } from "@/app/[locale]/(main)/_components/common/FormMessageI18n";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useDebounceInput } from "@/hooks/use-debouce-input";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import { useLocale, useTranslations } from "next-intl";
import {
  AuthErrorMessage,
  RegisterSchemaBody,
  type RegisterSchemaBodyType,
} from "@/schema/auth.schema";
import { validateEmail, validateUsername } from "@/features/auth/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface RegisterFormProps {
  isLoading: boolean;
  onRegister: (values: RegisterSchemaBodyType) => Promise<void>;
}

export const RegisterForm = ({ isLoading, onRegister }: RegisterFormProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const form = useForm<RegisterSchemaBodyType>({
    resolver: zodResolver(RegisterSchemaBody),
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const usernameValue = form.watch("username");
  const emailValue = form.watch("email");
  const debouncedUsername = useDebounceSearch({
    query: usernameValue.trim(),
    delay: 600,
  });
  const debouncedEmail = useDebounceSearch({
    query: emailValue.trim(),
    delay: 600,
  });
  const usernameRequestIdRef = useRef(0);
  const emailRequestIdRef = useRef(0);
  const [usernameCheck, setUsernameCheck] = useState<{
    value: string;
    available: boolean | null;
  }>({ value: "", available: null });
  const [emailCheck, setEmailCheck] = useState<{
    value: string;
    available: boolean | null;
  }>({ value: "", available: null });
  const isSubmitting = form.formState.isSubmitting;
  const isBusy = isLoading || isSubmitting;

  const checkUsernameAvailability = useCallback(
    async (username: string) => {
      const normalizedUsername = username.trim();

      if (normalizedUsername.length < 6) {
        setUsernameCheck({ value: normalizedUsername, available: null });
        return null;
      }

      const isFieldValid = await form.trigger("username");
      if (!isFieldValid) return null;

      const requestId = ++usernameRequestIdRef.current;
      const usernameRes = await validateUsername({
        username: normalizedUsername,
      });

      if (requestId !== usernameRequestIdRef.current) return null;

      const isAvailable = Boolean(usernameRes.data.available);
      setUsernameCheck({ value: normalizedUsername, available: isAvailable });

      if (!isAvailable) {
        form.setError("username", {
          type: "manual",
          message: AuthErrorMessage.USERNAME_EXISTS,
        });
        return false;
      }

      const usernameError = form.getFieldState("username").error;
      if (usernameError?.message === AuthErrorMessage.USERNAME_EXISTS) {
        form.clearErrors("username");
      }

      return true;
    },
    [form],
  );

  const checkEmailAvailability = useCallback(
    async (email: string) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        setEmailCheck({ value: normalizedEmail, available: null });
        return null;
      }

      const isFieldValid = await form.trigger("email");
      if (!isFieldValid) return null;

      const requestId = ++emailRequestIdRef.current;
      const emailRes = await validateEmail({ email: normalizedEmail });

      if (requestId !== emailRequestIdRef.current) return null;

      const isAvailable = Boolean(emailRes.data.available);
      setEmailCheck({ value: normalizedEmail, available: isAvailable });

      if (!isAvailable) {
        form.setError("email", {
          type: "manual",
          message: AuthErrorMessage.EMAIL_EXISTS,
        });
        return false;
      }

      const emailError = form.getFieldState("email").error;
      if (emailError?.message === AuthErrorMessage.EMAIL_EXISTS) {
        form.clearErrors("email");
      }

      return true;
    },
    [form],
  );

  useEffect(() => {
    if (!debouncedUsername) return;
    void checkUsernameAvailability(debouncedUsername);
  }, [checkUsernameAvailability, debouncedUsername]);

  useEffect(() => {
    if (!debouncedEmail) return;
    void checkEmailAvailability(debouncedEmail);
  }, [checkEmailAvailability, debouncedEmail]);

  const handleSubmit = async (values: RegisterSchemaBodyType) => {
    const toastId = toast.loading(t("auth.registerLoading"));

    try {
      const normalizedUsername = values.username.trim();
      const normalizedEmail = values.email.trim().toLowerCase();

      const [isUsernameAvailable, isEmailAvailable] = await Promise.all([
        usernameCheck.value === normalizedUsername
          ? Promise.resolve(usernameCheck.available)
          : checkUsernameAvailability(normalizedUsername),
        emailCheck.value === normalizedEmail
          ? Promise.resolve(emailCheck.available)
          : checkEmailAvailability(normalizedEmail),
      ]);

      if (isUsernameAvailable !== true) {
        toast.dismiss(toastId);
        return;
      }

      if (isEmailAvailable !== true) {
        toast.dismiss(toastId);
        return;
      }

      await onRegister(values);
      form.reset();
      toast.success(t("auth.register"), { id: toastId });
    } catch {
      toast.error(t("auth.registerFailed"), { id: toastId });
    }
  };

  useDebounceInput<RegisterSchemaBodyType>({
    form,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
        noValidate
      >
        <div className="mb-2">
          <p className="text-2xl font-semibold tracking-tight">Create your workspace account</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Join your colleagues and keep work conversations in one place.</p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                disabled={isBusy}
                placeholder="Tên người dùng"
                {...field}
              />
              <FormMessageI18n />
            </FormItem>
          )}
        />

        <FormField control={form.control} name="email" render={({ field }) => (<FormItem className="w-full"><Input disabled={isBusy} type="email" placeholder={t("auth.emailPlaceholder")} {...field} /><FormMessageI18n /></FormItem>)} />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                disabled={isBusy}
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
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
                disabled={isBusy}
                type="password"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                {...field}
              />
              <FormMessageI18n />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button
          disabled={isBusy}
          type="submit"
          className="mt-1 h-11 w-full rounded-xl font-semibold"
        >
          {isBusy ? <Spinner /> : t("auth.register")}
        </Button>

        {/* Link */}
        <p
          onClick={() => router.replace(`/${locale}/login`)}
          className="mt-2 block text-center text-sm font-medium text-primary hover:opacity-70 cursor-pointer"
        >
          {t("auth.alreadyHaveAccount")}
        </p>
      </form>
    </Form>
  );
};
