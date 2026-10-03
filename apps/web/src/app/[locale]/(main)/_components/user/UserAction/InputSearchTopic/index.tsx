"use client";

import { useSearchTopicsQuery } from "@/features/topic/hooks";
import { useDebounceSearch } from "@/hooks/use-debouce-search";
import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const InputSearchTopic = ({
  onTopicChange,
}: {
  onTopicChange?: (topic: string) => void;
}) => {
  const t = useTranslations();
  const [topic, setTopic] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedTopic = useDebounceSearch({
    query: topic.trim(),
    delay: 500,
  });

  const { data, isLoading } = useSearchTopicsQuery({
    query: { q: debouncedTopic },
    options: { enabled: Boolean(debouncedTopic) },
  });

  const topics = useMemo(() => {
    const rawTopics = data?.data ?? [];
    const topicNames = rawTopics
      .map((item) => item.name?.trim() ?? "")
      .filter((name) => name.length > 0);
    return Array.from(new Set(topicNames));
  }, [data]);

  const hasNoTopicResult =
    Boolean(debouncedTopic) && !isLoading && topics.length === 0;

  return (
    <div className="relative z-[999]">
      <input
        value={topic}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          e.stopPropagation();
          const nextValue = e.target.value;
          setTopic(nextValue);
          onTopicChange?.(nextValue);
          setOpen(true);
        }}
        placeholder={`${t("reply.addTopic")}`}
        className="text-xs focus:outline-0 whitespace-nowrap"
      />

      {open && debouncedTopic ? (
        <div
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-6 left-0 w-56 rounded-md border bg-background p-1 shadow-md z-[999]"
        >
          <div className="max-h-44 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Đang tìm chủ đề...
              </div>
            ) : null}

            {!isLoading && topics.length
              ? topics.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs hover:bg-accent"
                    onClick={() => {
                      setTopic(item);
                      setOpen(false);
                      onTopicChange?.(item);
                    }}
                  >
                    <span>#{item}</span>
                  </button>
                ))
              : null}

            {hasNoTopicResult ? (
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs hover:bg-accent"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Plus className="size-3" />
                <span>Thêm chủ đề #{debouncedTopic}</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InputSearchTopic;
