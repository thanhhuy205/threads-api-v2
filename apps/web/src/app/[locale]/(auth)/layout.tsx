import Logo from "@/app/[locale]/(main)/_components/common/Logo";
import { verifySession } from "@/features/auth/server/session";
import { Building2, CheckCircle2, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await verifySession();

  if (user) {
    redirect(`/${locale}`);
  }

  return (
    <div className="min-h-dvh bg-[#f6f8fc] text-foreground transition-colors dark:bg-[#05070b] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-slate-950 px-12 py-12 text-white lg:flex lg:flex-col dark:border-r dark:border-white/10 dark:bg-[#080d18]">
        <div className="absolute -left-20 top-24 size-80 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute -bottom-28 right-0 size-96 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white p-2 text-slate-950">
            <Logo />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            PulseBoard
          </span>
        </div>

        <div className="relative my-auto max-w-lg">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Building2 className="size-3.5" /> Internal workspace
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            One space for your team to share, align, and move work forward.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Keep announcements, discussions and team knowledge together in a
            calm, connected workspace.
          </p>
          <div className="mt-10 space-y-4 text-sm text-slate-200">
            <p className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-blue-300" /> Company updates
              everyone can find
            </p>
            <p className="flex items-center gap-3">
              <UsersRound className="size-5 text-blue-300" /> Conversations
              built for teams
            </p>
          </div>
        </div>
        <p className="relative text-xs text-slate-400">
          © 2026 PulseBoard · Your team&apos;s shared space
        </p>
      </aside>

      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden p-5 sm:p-8">
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl dark:block" />
        <div className="relative w-full max-w-[440px] rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 transition-colors dark:border-white/10 dark:bg-[#0d1119] dark:shadow-2xl dark:shadow-black/50 sm:p-9">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="size-10 rounded-xl bg-slate-950 p-2 text-white ring-1 ring-transparent dark:bg-white dark:text-slate-950 dark:ring-white/20">
              <Logo />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              PulseBoard
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
