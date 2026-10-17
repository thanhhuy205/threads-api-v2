import type { Metadata } from "next";

import HomeCommunityBelief from "./_components/home-community-belief";
import HomeFooter from "./_components/home-footer";
import HomeHeader from "./_components/home-header";
import HomeHero from "./_components/home-hero";
import HomeHowItWorks from "./_components/home-how-it-works";
import HomeStats from "./_components/home-stats";
import HomeStories from "./_components/home-stories";
import HomeTrust from "./_components/home-trust";
import HomeWhy from "./_components/home-why";
import JoinHome from "./_components/join-home";

export const metadata: Metadata = {
  title: "Community Social Business",
  description: "Connect people, ideas, and opportunities that move forward.",
};

export default function Page() {
  return (
    <main id="top" className="min-h-screen bg-background text-foreground">
      <HomeHeader />
      <HomeHero />
      <HomeStories />
      <HomeStats />
      <HomeHowItWorks />
      <HomeWhy />
      <HomeCommunityBelief />
      <HomeTrust />
      <JoinHome />
      <HomeFooter />
    </main>
  );
}
