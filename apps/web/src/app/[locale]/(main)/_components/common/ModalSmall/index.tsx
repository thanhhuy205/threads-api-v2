"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import ModalPopup from "../ModalPopup";

interface ModalSmallConfirmData {
  userId?: number;
  postId?: string | number;
  reason?: string;
}

interface ModalSmallProps {
  mode: "block" | "delete" | "report";
  username?: string;
  userId?: number;
  postId?: string | number;
  onConfirm: (data?: ModalSmallConfirmData) => void | Promise<void>;
  onCancel: () => void;
}

const REPORT_REASON_MAX_LENGTH = 1000;

const reportSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập lý do")
    .max(REPORT_REASON_MAX_LENGTH, `Tối đa ${REPORT_REASON_MAX_LENGTH} ký tự`),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export default function ModalSmall({
  mode,
  username,
  userId,
  postId,
  onConfirm,
  onCancel,
}: ModalSmallProps) {
  const t = useTranslations();
  const isReportMode = mode === "report";
  const name = username || t("modal.anonymous");

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: "" },
  });

  let title = t("modal.deleteTitle");
  let description = t("modal.deleteDesc");
  let confirmLabel = t("modal.deleteBtn");

  if (mode === "block") {
    title = t("modal.blockTitle", { name });
    description = t("modal.blockDesc", { name });
    confirmLabel = t("modal.blockBtn");
  }

  if (mode === "report") {
    title = t("modal.reportTitle");
    description = t("modal.reportDesc");
    confirmLabel = t("modal.reportBtn");
  }

  const handleNonReportConfirm = () => {
    void onConfirm({ userId, postId });
  };

  const onReportSubmit = (values: ReportFormValues) => {
    void onConfirm({ userId, postId, reason: values.reason });
  };

  return (
    <ModalPopup isMobileSheet={false} mode="custom" onClose={onCancel}>
      <div
        className={cn(
          "bg-primary-foreground border-primary rounded-xl w-[340px] max-w-full",
          isReportMode && "w-[420px]",
          "flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.15)]",
        )}
      >
        <div className="px-5 pt-5 pb-4 border-b border-gray-200">
          <h2 className="text-center font-semibold text-base leading-tight">
            {title}
          </h2>
        </div>

        {isReportMode ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onReportSubmit)}>
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-gray-500 leading-snug whitespace-pre-line">
                  {description}
                </p>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("modal.reportReasonPlaceholder")}
                          maxLength={REPORT_REASON_MAX_LENGTH}
                          className="min-h-[108px] resize-none text-sm"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between">
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-gray-400 ml-auto">
                          {field.value.length}/{REPORT_REASON_MAX_LENGTH}
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="px-2 border-t border-gray-200 flex gap-0 relative">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 py-1 px-0 cursor-pointer border-r border-gray-200 rounded-none"
                  onClick={onCancel}
                >
                  {t("modal.cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="ghost"
                  className="flex-1 py-1 px-0 cursor-pointer rounded-none text-red-600 font-semibold"
                >
                  {confirmLabel}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <>
            <div className="px-5 py-4">
              <p className="text-center text-sm text-gray-500 leading-snug whitespace-pre-line px-4">
                {description}
              </p>
            </div>

            <div className="px-2 border-t border-gray-200 flex gap-0 relative">
              <Button
                variant="ghost"
                className="flex-1 py-1 px-0 cursor-pointer border-r border-gray-200 rounded-none"
                onClick={onCancel}
              >
                {t("modal.cancel")}
              </Button>
              <Button
                variant="ghost"
                className="flex-1 py-1 px-0 cursor-pointer rounded-none text-red-600 font-semibold"
                onClick={handleNonReportConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </>
        )}
      </div>
    </ModalPopup>
  );
}
