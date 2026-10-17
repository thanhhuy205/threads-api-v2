import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  ["01", "Share a useful question", "Start with the idea, challenge, or opportunity that matters to you.", "You do this once"],
  ["02", "Find the right people", "Meet people who care about the same outcome, not just the same title.", "Within days"],
  ["03", "Take a next step", "Turn good conversation into a project, introduction, or shared commitment.", "Together"],
] as const;

export default function HomeHowItWorks() {
  return <section id="how-it-works" className="border-b bg-muted/30"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><div className="mx-auto max-w-2xl text-center"><Badge variant="outline">How it works</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Less networking. More belonging.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{steps.map(([number, title, copy, when]) => <Card key={number}><CardHeader><div className="flex items-center justify-between"><Badge variant="outline">{number}</Badge><span className="text-xs text-muted-foreground">{when}</span></div><CardTitle className="pt-5">{title}</CardTitle><CardDescription className="leading-6">{copy}</CardDescription></CardHeader></Card>)}</div></div></section>;
}
