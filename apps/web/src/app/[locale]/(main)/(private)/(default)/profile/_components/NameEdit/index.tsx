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
import { ChevronLeft } from "lucide-react";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống").max(50, "Tên tối đa 50 ký tự"),
});

type NameFormValues = z.infer<typeof nameSchema>;

const NameEdit = ({
  nameText,
  onSave,
  setActiveModal,
}: {
  nameText: string;
  onSave: (name: string) => void;
  setActiveModal: (value: "main" | "name" | "links") => void;
}) => {
  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: nameText },
  });

  const onSubmit = (values: NameFormValues) => {
    onSave(values.name);
    setActiveModal("main");
  };

  return (
    <CardContent className="p-0">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              type="button"
              onClick={() => setActiveModal("main")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="font-semibold">Chỉnh sửa tên</h2>

            <button
              type="submit"
              className="text-primary font-semibold"
            >
              Lưu
            </button>
          </div>

          {/* Input */}
          <div className="p-4 space-y-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-12 text-base rounded-lg shadow-none"
                      placeholder="Nhập tên của bạn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </CardContent>
  );
};

export default NameEdit;
