import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap | PulseBoard",
  description: "See what the PulseBoard team is building next.",
};

export default function RoadmapPage() {
  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 md:px-10">
      <p className="text-sm font-medium text-muted-foreground">PulseBoard</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">Roadmap</h1>
      <p className="mt-3 text-muted-foreground">
        Follow the work and improvements planned for PulseBoard.
      </p>
    </section>
  );
}
