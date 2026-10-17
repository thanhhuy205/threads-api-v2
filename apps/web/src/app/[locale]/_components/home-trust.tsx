import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const trust = [["People first", "No tracking of your private life. Only what you choose to share."], ["No pressure", "Join, listen, or lead. Nobody is counting."], ["Open by default", "Circles are open to anyone willing to help."], ["Leave any time", "Remove your profile and posts whenever you like."]] as const;

export default function HomeTrust() {
  return <section id="trust" className="border-b"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><div className="max-w-2xl"><Badge variant="outline">Your data</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">What happens to my data?</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{trust.map(([title, copy]) => <Card key={title} className="shadow-none"><CardHeader><CardTitle className="text-lg">{title}</CardTitle><CardDescription className="leading-6">{copy}</CardDescription></CardHeader></Card>)}</div></div></section>;
}
