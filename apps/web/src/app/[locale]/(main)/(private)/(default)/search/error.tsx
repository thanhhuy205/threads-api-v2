"use client";

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[360px] max-w-2xl flex-col items-center justify-center gap-3 p-6 text-center">
      <h2 className="text-lg font-semibold text-foreground">
        Không thể tải tìm kiếm
      </h2>
      <p className="text-sm text-muted-foreground">
        Có lỗi khi tải kết quả hoặc gợi ý tìm kiếm.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background"
      >
        Thử lại
      </button>
    </div>
  );
}
