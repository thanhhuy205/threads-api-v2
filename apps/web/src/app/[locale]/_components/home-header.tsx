import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function HomeHeader() {
  return (
    <>
      <div className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-sm text-muted-foreground sm:px-6">
          <span>New circles are opening every week.</span>
          <a
            href="#join"
            className="font-medium text-foreground underline-offset-4 hover:underline">
            Join one
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg border bg-muted text-sm">CS</span>
            <span className="hidden sm:inline">Community Social Business</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Main navigation">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#why" className="transition-colors hover:text-foreground">Why us</a>
            <a href="#community" className="transition-colors hover:text-foreground">Community</a>
            <a href="#trust" className="transition-colors hover:text-foreground">Your data</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" className="hidden sm:inline-flex" render={<a href="#join" />}>
              Sign in
            </Button>
            <Button size="sm" render={<a href="#join" />}>
              Get started <ArrowRight />
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
