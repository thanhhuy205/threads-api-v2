import { MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeStories() {
  return (
    <section className="border-b bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center"><Badge variant="outline">What this looks like</Badge><h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">The right conversation can change the direction.</h2><p className="mt-5 leading-7 text-muted-foreground">Most good ideas stay small because the people who could help never find each other. We make that first connection easier.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card><CardHeader><Badge variant="secondary" className="w-fit">A question worth asking</Badge><CardTitle className="pt-3 text-2xl leading-tight">"What would our city look like if every empty shop could become useful?"</CardTitle><CardDescription>Shared by Samira · 2h ago</CardDescription></CardHeader></Card>
          <Card><CardHeader><div className="flex items-center gap-2 text-sm"><span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-semibold">K</span><span className="font-medium">Kenji replied</span><span className="text-muted-foreground">just now</span></div><CardTitle className="pt-3 text-xl leading-snug">I know three makers looking for exactly this kind of space. Shall we start a circle?</CardTitle></CardHeader><CardFooter className="gap-5 border-t text-sm text-muted-foreground"><span className="flex items-center gap-1"><MessageCircle className="size-4" />9</span><span>24 people interested</span></CardFooter></Card>
        </div>
      </div>
    </section>
  );
}
