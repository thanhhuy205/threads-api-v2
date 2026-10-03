import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useDebounceInput<T extends FieldValues>({
  form,
  delay = 800,
}: {
  form: UseFormReturn<T>;
  delay?: number;
}) {
  useEffect(() => {
    const subscription = form.watch((_, { name }) => {
      const timeoutId = setTimeout(() => {
        if (name) form.trigger(name);
      }, delay);

      return () => clearTimeout(timeoutId);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form, delay]);
}
