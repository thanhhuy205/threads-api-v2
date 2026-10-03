import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | PulseBoard",
  description: "Meet the team behind PulseBoard.",
};

export default function TeamsPage() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 md:px-10">
      <p className="text-sm font-medium text-muted-foreground">PulseBoard</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Teams</h1>
      <p className="mt-3 text-muted-foreground">
        Meet the people building PulseBoard.
      </p>
    </section>
  );
}
