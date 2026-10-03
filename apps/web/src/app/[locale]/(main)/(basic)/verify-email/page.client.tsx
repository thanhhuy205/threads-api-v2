"use client";

import loginLogo from "@/assets/images/logoLogin.png";
import Logo from "@/app/[locale]/(main)/_components/common/Logo";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { MailWarning, ArrowLeft } from "lucide-react";

export default function VerifyEmailPageClient() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="fixed inset-0 z-[9999] bg-background text-foreground flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background logo banner like login page */}
      <div className="w-full absolute inset-0 pointer-events-none hidden sm:block overflow-hidden opacity-80">
        <img 
          src={loginLogo.src} 
          alt="Background Banner" 
          className="w-full h-full object-cover object-center" 
        />
      </div>

      {/* Glow highlight for dark/light premium touch */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-30 blur-[100px] pointer-events-none">
        <div className="h-[250px] w-[250px] rounded-full bg-destructive/15" />
      </div>

      {/* Small top logo for brand consistency on mobile */}
      <div className="sm:hidden size-14 mb-6 relative z-10">
        <Logo />
      </div>

      {/* Extremely clean, flat premium Card (no shadow as requested) */}
      <div className="relative z-10 w-full max-w-[390px] rounded-[28px] border border-border/40 bg-card/45 p-8 backdrop-blur-xl transition-all duration-300">
        <div className="flex flex-col items-center text-center">
          {/* Warn icon */}
          <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <MailWarning className="size-8" />
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
            {t("auth.tokenExpired")}
          </h1>

          <p className="mb-8 text-[14px] leading-relaxed text-muted-foreground px-1">
            {t("auth.resendEmailError")}. {t("auth.forgotError")}
          </p>

          <div className="w-full space-y-3">
            <Button
              asChild
              className="w-full h-11 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Link href={`/${locale}/login`}>
                {t("auth.goToLogin")}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-11 rounded-2xl border-border/60 bg-transparent font-semibold hover:bg-secondary/40 transition-all duration-200 active:scale-[0.98] cursor-pointer"
            >
              <Link href={`/${locale}/`} className="flex items-center justify-center gap-2">
                <ArrowLeft className="size-4" />
                Quay lại trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
