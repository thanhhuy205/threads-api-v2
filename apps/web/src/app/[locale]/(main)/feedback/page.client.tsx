"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpRight,
  CheckCircle2,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const feedbackSchema = z.object({
  type: z.string().min(1, "Please select a feedback type."),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(120, "Title is too long."),
  description: z
    .string()
    .trim()
    .min(10, "Please add a little more detail.")
    .max(2000, "Description is too long."),
  email: z.string().trim().email("Please enter a valid email address."),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

const feedbackTypes = ["bug", "idea", "experience", "other"] as const;

export default function FeedbackPage() {
  const t = useTranslations("feedback");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { type: "", title: "", description: "", email: "" },
  });

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];
    setFileError("");

    if (!nextFile) return;
    if (nextFile.size > MAX_FILE_SIZE) {
      setFileError(t("fileTooLarge"));
      event.target.value = "";
      return;
    }

    setFile(nextFile);
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function submitFeedback() {
    // The form is ready to connect to a feedback API when one is available.
    setSubmitted(true);
  }

  function resetFeedback() {
    form.reset();
    removeFile();
    setFileError("");
    setSubmitted(false);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fa] px-5 py-8 text-[#101113] sm:px-8 lg:px-14 lg:py-12">
      <div className="pointer-events-none absolute -top-40 -right-40 size-[32rem] rounded-full bg-[#e7d8ff] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 size-[28rem] rounded-full bg-[#d6f3f2] opacity-70 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-[13px] bg-black text-white shadow-sm">
              <MessageSquare className="size-5" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-semibold tracking-[-0.04em]">PulseBoard</span>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-xs font-medium text-black/55 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {t("status")}
          </span>
        </header>

        <section className="grid items-start gap-10 pb-10 pt-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20 lg:pt-24">
          <div className="pt-2">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/55 shadow-sm">
              <Sparkles className="size-3.5" />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] sm:text-6xl lg:text-[4.7rem]">
              {t("headline")} <span className="text-black/35">{t("headlineAccent")}</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-black/55">{t("intro")}</p>
            <div className="mt-12 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-black/8 bg-white/70 p-4">
                <p className="text-2xl font-semibold tracking-[-0.05em]">01</p>
                <p className="mt-1 text-xs leading-5 text-black/45">{t("stepOne")}</p>
              </div>
              <div className="rounded-2xl border border-black/8 bg-white/70 p-4">
                <p className="text-2xl font-semibold tracking-[-0.05em]">02</p>
                <p className="mt-1 text-xs leading-5 text-black/45">{t("stepTwo")}</p>
              </div>
            </div>
          </div>

          <Card className="rounded-[28px] border-black/8 bg-white p-6 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.28)] sm:p-9">
            {submitted ? (
              <div className="flex min-h-[530px] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{t("successTitle")}</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">{t("successDescription")}</p>
                <Button variant="outline" className="mt-8 rounded-full px-5" onClick={resetFeedback}>
                  {t("sendAnother")}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitFeedback)} className="space-y-6" noValidate>
                  <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.04em]">{t("formTitle")}</h2>
                      <p className="mt-1.5 text-sm text-black/45">{t("formDescription")}</p>
                    </div>
                    <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[11px] font-medium text-black/45">
                      {t("required")}
                    </span>
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("typeLabel")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 w-full rounded-xl border-black/10 bg-[#fafafa] px-4">
                              <SelectValue placeholder={t("typePlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {feedbackTypes.map((type) => (
                              <SelectItem key={type} value={type}>{t(`types.${type}`)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("titleLabel")}</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl border-black/10 bg-[#fafafa] px-4" placeholder={t("titlePlaceholder")} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("descriptionLabel")}</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-32 resize-y rounded-xl border-black/10 bg-[#fafafa] px-4 py-3" placeholder={t("descriptionPlaceholder")} {...field} />
                        </FormControl>
                        <FormDescription>{t("descriptionHint")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("emailLabel")}</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-12 rounded-xl border-black/10 bg-[#fafafa] px-4" placeholder={t("emailPlaceholder")} {...field} />
                        </FormControl>
                        <FormDescription>{t("emailHint")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-2">
                    <p className="text-sm font-medium">
                      {t("fileLabel")} <span className="font-normal text-black/35">({t("optional")})</span>
                    </p>
                    <input ref={fileInputRef} type="file" className="sr-only" accept="image/*,.pdf,.txt,.log" onChange={onFileChange} />
                    {file ? (
                      <div className="flex items-center justify-between rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText className="size-4 shrink-0 text-black/45" />
                          <span className="truncate text-sm">{file.name}</span>
                        </div>
                        <button type="button" aria-label={t("removeFile")} onClick={removeFile} className="ml-3 rounded-full p-1 text-black/35 hover:bg-black/5 hover:text-black">
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-[#fafafa] text-sm font-medium text-black/50 transition-colors hover:border-black/35 hover:bg-black/[0.02]">
                        <Paperclip className="size-4" />
                        {t("filePlaceholder")}
                      </button>
                    )}
                    {fileError && <p className="text-xs text-destructive">{fileError}</p>}
                  </div>

                  <Button type="submit" className="h-12 w-full rounded-xl bg-black font-semibold text-white hover:bg-black/80">
                    <Send className="size-4" />
                    {t("submit")}
                    <ArrowUpRight className="size-4" />
                  </Button>
                  <p className="text-center text-xs leading-5 text-black/35">{t("privacyNote")}</p>
                </form>
              </Form>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
