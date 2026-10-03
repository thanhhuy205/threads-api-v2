"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

const newLinkSchema = z.object({
  title: z.string().trim().nullable().optional(),
  url: z.string().trim().refine(val => !val || z.string().url().safeParse(val).success, {
    message: "Url must be a valid URL",
  }).nullable().optional(),
});

type NewLinkFormValues = z.infer<typeof newLinkSchema>;

interface LinksEditModalProps {
  links: { title: string; url: string }[];
  onAddLink: (link: { title: string; url: string }) => void;
  onRemoveLink: (index: number) => void;
  onUpdateLink: (index: number, field: "title" | "url", value: string) => void;
  setActiveModal: (modal: "main" | "name" | "bio" | "links") => void;
}

const LinksEditModal = ({
  links,
  onAddLink, // We won't use this if we only support one link
  onRemoveLink,
  onUpdateLink,
  setActiveModal,
}: LinksEditModalProps) => {
  const t = useTranslations();
  
  const currentLink = links.length > 0 ? links[0] : { title: "", url: "" };

  const form = useForm<NewLinkFormValues>({
    resolver: zodResolver(newLinkSchema),
    defaultValues: { title: currentLink.title, url: currentLink.url },
  });

  const onSubmit = (values: NewLinkFormValues) => {
    if (values.title && values.url) {
      // Update or add the first link
      if (links.length > 0) {
        onUpdateLink(0, "title", values.title);
        onUpdateLink(0, "url", values.url);
      } else {
        onAddLink({ title: values.title, url: values.url });
      }
    } else {
      // If one of them is empty, treat as remove
      onRemoveLink(0);
    }
    setActiveModal("main");
  };

  return (
    <CardContent className="p-0 bg-primary-foreground">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between p-4 border-b">
            <button
              type="button"
              onClick={() => setActiveModal("main")}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="font-semibold">{t("profileSettings.linkModalTitle")}</h2>

            <button
              type="submit"
              className="text-primary font-semibold"
            >
              {t("profileSettings.done")}
            </button>
          </div>

          <div className="p-4 space-y-6">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={t("profileSettings.linkTitlePlaceholder") || "Tiêu đề liên kết"}
                        className="h-11 rounded-lg"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={t("profileSettings.linkUrlPlaceholder") || "Đường dẫn URL"}
                        className="h-11 rounded-lg"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default LinksEditModal;