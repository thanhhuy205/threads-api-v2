import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import ModalPopup from "../../common/ModalPopup";

const OTHER_REASON_KEY = "other";

type ReasonOption = {
  key: string;
  label: string;
};

type ReportPostModalProps = {
  onClose: () => void;
  onSubmit: (reason: string) => Promise<boolean>;
};

export default function ReportPostModal({
  onClose,
  onSubmit,
}: ReportPostModalProps) {
  const t = useTranslations();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const reasonOptions = useMemo<ReasonOption[]>(
    () => [
      { key: "dislike", label: t("modal.reportReasons.dislike") },
      { key: "bullying", label: t("modal.reportReasons.bullying") },
      { key: "selfHarm", label: t("modal.reportReasons.selfHarm") },
      { key: "violence", label: t("modal.reportReasons.violence") },
      { key: "restrictedGoods", label: t("modal.reportReasons.restrictedGoods") },
      { key: "sexual", label: t("modal.reportReasons.sexual") },
      { key: "scam", label: t("modal.reportReasons.scam") },
      { key: "falseInfo", label: t("modal.reportReasons.falseInfo") },
      { key: "ip", label: t("modal.reportReasons.ip") },
      { key: OTHER_REASON_KEY, label: t("modal.reportReasons.other") },
    ],
    [t],
  );

  const resetError = () => {
    if (error) setError("");
  };

  const submitReason = async (finalReason: string) => {
    setIsSubmitting(true);
    const ok = await onSubmit(finalReason);
    setIsSubmitting(false);

    if (ok) {
      setShowSuccess(true);
      return true;
    }

    setError(t("toast.reportError"));
    return false;
  };

  const handlePickReason = async (reasonKey: string) => {
    resetError();
    setSelectedReason(reasonKey);

    if (reasonKey === OTHER_REASON_KEY) {
      setShowOtherInput(true);
      return;
    }

    setShowOtherInput(false);

    const pickedLabel =
      reasonOptions.find((reason) => reason.key === reasonKey)?.label ?? "";
    if (!pickedLabel) {
      setError(t("modal.reportReasonRequired"));
      return;
    }

    await submitReason(pickedLabel);
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError(t("modal.reportReasonRequired"));
      return;
    }

    const finalReason = otherReason.trim();

    if (!finalReason) {
      setError(t("modal.reportReasonRequired"));
      return;
    }

    await submitReason(finalReason);
  };

  const isSubmitDisabled = isSubmitting || !otherReason.trim();

  return (
    <ModalPopup
      isMobileSheet={false}
      mode="custom"
      onClose={onClose}
      closeOnBackdropClick={!isSubmitting}
    >
      <div className="bg-primary-foreground border border-gray-200 rounded-2xl -translate-y-10 w-[520px] max-w-[94vw] max-h-[56vh] flex flex-col shadow-[0_12px_34px_rgba(0,0,0,0.18)] overflow-hidden">
        <div className="h-12 border-b border-gray-200 p-5 flex items-center justify-between">
          <button
            type="button"
            onClick={
              showOtherInput && !showSuccess ? () => setShowOtherInput(false) : onClose
            }
            className="size-9 inline-flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            aria-label={t("menu.back")}
            disabled={isSubmitting}
          >
            <ChevronLeft className="size-5" />
          </button>

          <h2 className="font-semibold text-[18px] leading-none text-black">
            {t("menu.report")}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="size-9 inline-flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            aria-label={t("common.close")}
            disabled={isSubmitting}
          >
            <X className="size-6" />
          </button>
        </div>

        {!showSuccess && (
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 text-center">
            <h3 className="text-[25px] leading-tight font-semibold text-black">
              {t("modal.reportFlowQuestion")}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-500 max-w-[560px] mx-auto">
              {t("modal.reportFlowDescription")}
            </p>
          </div>
        )}

        {showSuccess ? (
          <div className="p-7 flex-1 flex flex-col items-center justify-center text-center">
            <div className="size-14 rounded-full bg-green-100 text-green-700 inline-flex items-center justify-center">
              <Check className="size-8" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-black">
              {t("modal.reportFlowThanksTitle")}
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              {t("modal.reportFlowThanksDescription")}
            </p>
            <Button className="mt-6 min-w-32" onClick={onClose}>
              {t("modal.reportFlowDone")}
            </Button>
          </div>
        ) : showOtherInput ? (
          <div className="p-5 flex-1 overflow-y-scroll">
            <div className="space-y-3">
              <p className="text-sm font-medium text-black">
                {t("modal.reportReasons.other")}
              </p>
              <Input
                value={otherReason}
                onChange={(event) => {
                  setOtherReason(event.target.value);
                  resetError();
                }}
                placeholder={t("modal.reportReasonPlaceholder")}
                disabled={isSubmitting}
                maxLength={1000}
                className="h-11"
              />
              <p className="text-xs text-right text-gray-400">
                {otherReason.length}/1000
              </p>
            </div>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            <div className="pt-5 flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
                {isSubmitting ? t("toast.reporting") : t("modal.reportBtn")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-scroll py-1.5">
            {reasonOptions.map((reason) => {
              const isSelected = selectedReason === reason.key;

              return (
                <button
                  key={reason.key}
                  type="button"
                  className={cn(
                    "w-full px-5 py-3.5 text-left flex items-center justify-between hover:bg-black/5 transition-colors",
                    isSelected && "bg-black/5",
                  )}
                  onClick={() => {
                    void handlePickReason(reason.key);
                  }}
                  disabled={isSubmitting}
                >
                  <span className="text-[16px] leading-tight text-black">
                    {reason.label}
                  </span>
                  <ChevronRight className="size-6 text-gray-400" />
                </button>
              );
            })}

            {error && <p className="text-sm text-red-600 px-6 py-3">{error}</p>}
          </div>
        )}
      </div>
    </ModalPopup>
  );
}
