import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomeCommunityBelief() {
  return <section id="community" className="border-b bg-muted/30"><div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6"><Badge variant="outline">Our belief</Badge><h2 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">Business can be human, and human can be powerful.</h2><p className="mx-auto mt-6 max-w-xl leading-7 text-muted-foreground">We are making space for work with a wider definition of success: useful, generous, and built to last.</p><Button variant="outline" className="mt-8" render={<a href="#join" />}>Find your people <ArrowRight /></Button></div></section>;
}
