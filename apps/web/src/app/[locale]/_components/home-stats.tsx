import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [["38%", "of good ideas stall because the right people never meet."], ["3x", "faster progress when a project starts with an introduction."], ["24", "ideas shared in the community this week."]] as const;

export default function HomeStats() {
  return <section className="border-b"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><div className="max-w-2xl"><Badge variant="outline">By the numbers</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Small signals. Shared momentum.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{stats.map(([value, copy]) => <Card key={value} className="shadow-none"><CardHeader><CardTitle className="text-5xl font-semibold tracking-tight">{value}</CardTitle><CardDescription className="pt-2 leading-6">{copy}</CardDescription></CardHeader></Card>)}</div></div></section>;
}
