"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";

const BIO_MAX_LENGTH = 150;

const bioSchema = z.object({
  bio: z.string().max(BIO_MAX_LENGTH, `Tiểu sử tối đa ${BIO_MAX_LENGTH} ký tự`),
});

type BioFormValues = z.infer<typeof bioSchema>;

const BioEditModal = ({
  bioText,
  onSave,
  setActiveModal,
}: {
  bioText: string;
  onSave: (bio: string) => void;
  setActiveModal: (value: "main" | "bio" | "links") => void;
}) => {
  const form = useForm<BioFormValues>({
    resolver: zodResolver(bioSchema),
    defaultValues: { bio: bioText },
  });

  const bio = form.watch("bio");

  const onSubmit = (values: BioFormValues) => {
    onSave(values.bio);
    setActiveModal("main");
  };

  return (
    <CardContent className="p-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between p-4 border-b">
            <button
              type="button"
              onClick={() => setActiveModal("main")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="font-semibold">Chỉnh sửa tiểu sử</h2>

            <button type="submit" className="text-primary font-semibold">
              Lưu
            </button>
          </div>

          <div className="p-4 space-y-1">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-full h-32 p-3 rounded-lg resize-none shadow-none focus:outline-none focus:ring-2 focus:ring-none border-0"
                      placeholder="Viết vài dòng về bản thân..."
                      maxLength={BIO_MAX_LENGTH}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between">
                    <FormMessage className="text-xs" />
                    <p className="text-sm text-gray-500 ml-auto">
                      {bio.length}/{BIO_MAX_LENGTH}
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default BioEditModal;
