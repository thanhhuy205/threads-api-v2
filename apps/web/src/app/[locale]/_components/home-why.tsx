import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const reasons = [["Customised", "Matched on the outcome you care about, not on a job title."], ["Fast", "From a first question to a first reply, often within hours."], ["Human", "Real people, real conversations, no algorithmic noise."]] as const;
const benefits = ["You find collaborators who already care about the same problem.", "It runs on a simple question. No pitch deck, no formal application.", "You stay in control of what you share and who sees it.", "Most good opportunities are already one introduction away.", "You can look back and see what your conversations turned into."] as const;

export default function HomeWhy() {
  return <section id="why" className="border-b"><div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.9fr_1.1fr]"><div><Badge variant="outline">Why us</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">Five reasons this is worth half an hour.</h2><div className="mt-8 grid gap-3">{reasons.map(([title, copy]) => <Card key={title} className="shadow-none"><CardHeader><CardTitle className="text-base">{title}</CardTitle><CardDescription>{copy}</CardDescription></CardHeader></Card>)}</div></div><Card className="self-start shadow-none"><CardContent className="p-0">{benefits.map((text, index) => <div key={text}><div className="flex gap-4 p-6"><span className="text-sm font-semibold text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><p className="leading-7">{text}</p></div>{index < benefits.length - 1 && <Separator />}</div>)}</CardContent></Card></div></section>;
}
