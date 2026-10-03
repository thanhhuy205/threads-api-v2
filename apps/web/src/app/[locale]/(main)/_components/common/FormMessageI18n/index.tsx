import { useFormField } from "@/components/ui/form";
import { useTranslations } from "next-intl";

export function FormMessageI18n() {
  const { error } = useFormField();
  const t = useTranslations();

  if (!error) return null;

  return (
    <p className="text-sm font-medium text-destructive">{t(error.message!)}</p>
  );
}

