"use client";

export default function PrivateDefaultError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 bg-primary-foreground px-6 text-center">
      <h2 className="text-lg font-semibold text-foreground">
        Không thể tải trang cá nhân
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Dữ liệu riêng tư chưa tải được. Hãy thử lại.
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
