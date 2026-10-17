import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function JoinHome() {
  return <section id="join"><div className="mx-auto max-w-6xl px-4 py-20 sm:px-6"><Card className="shadow-none"><CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-14"><h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Your next good connection is here.</h2><p className="max-w-xl leading-7 text-muted-foreground">Start with a question, an idea, or simply a willingness to help.</p><div className="flex flex-wrap justify-center gap-3"><Button size="lg" render={<a href="mailto:hello@community.social" />}>Get started <ArrowRight /></Button><Button size="lg" variant="outline" render={<a href="#how-it-works" />}>Read how it works</Button></div><p className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4" /> No pitch. No pressure. Just people.</p></CardContent></Card></div></section>;
}
