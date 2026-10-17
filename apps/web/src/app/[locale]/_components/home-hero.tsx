import { ArrowRight, MessageCircle, Sparkles, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const activity = [
  ["Local food systems", "12 conversations", "Growing"],
  ["Creative technology", "08 projects", "Active"],
  ["Learning for everyone", "24 introductions", "Growing"],
  ["Better neighbourhoods", "06 partnerships", "New"],
] as const;

export default function HomeHero() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <Badge variant="outline" className="mb-6"><Sparkles /> Community platform</Badge>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">Good business starts with people.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Community Social Business brings together curious people, generous ideas, and the small actions that make a real difference. Start with one question, get your people back.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" render={<a href="#join" />}>Get started <ArrowRight /></Button>
            <Button size="lg" variant="outline" render={<a href="#how-it-works" />}>See how it works</Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">No pitch. No pressure. Just people.</p>
        </div>

        <Card className="mt-14 overflow-hidden shadow-none">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><CardTitle>Community pulse</CardTitle><CardDescription>What people are moving forward today</CardDescription></div>
              <div className="flex items-center gap-2"><Badge variant="secondary">Live</Badge><Badge variant="outline">88 members online</Badge></div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-0 lg:grid-cols-[1.2fr_.8fr]">
            <div className="p-6">
              <Table><TableHeader><TableRow><TableHead>Circle</TableHead><TableHead>Movement</TableHead><TableHead className="text-right">Energy</TableHead></TableRow></TableHeader>
                <TableBody>{activity.map(([circle, movement, energy]) => <TableRow key={circle}><TableCell className="font-medium">{circle}</TableCell><TableCell className="text-muted-foreground">{movement}</TableCell><TableCell className="text-right"><Badge variant="outline">{energy}</Badge></TableCell></TableRow>)}</TableBody>
              </Table>
            </div>
            <div className="space-y-4 border-t bg-muted/20 p-6 lg:border-t-0 lg:border-l">
              <div className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-full bg-muted text-sm font-semibold">MA</div><div><p className="text-sm font-medium">Mai Anh</p><p className="text-xs text-muted-foreground">Building local change</p></div><Badge variant="outline" className="ml-auto">Online</Badge></div>
                <p className="mt-4 text-sm leading-6">"Who wants to make our high street easier to share?"</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MessageCircle className="size-3.5" />18 replies</span><span>7 collaborators</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">{[["24", "ideas shared"], ["08", "new circles"], ["56", "introductions"]].map(([number, label]) => <div key={label} className="rounded-lg border bg-background p-3"><p className="text-lg font-semibold">{number}</p><p className="text-xs text-muted-foreground">{label}</p></div>)}</div>
            </div>
          </CardContent>
          <CardFooter className="border-t text-sm text-muted-foreground"><UsersRound className="mr-2 size-4" /> People are gathering around ideas near you.</CardFooter>
        </Card>
      </div>
    </section>
  );
}
