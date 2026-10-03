import type { Metadata } from "next";
import FeedbackPage from "./page.client";

export const metadata: Metadata = {
  title: "Feedback | PulseBoard",
  description: "Share your feedback with the PulseBoard team.",
};

export default function Page() {
  return <FeedbackPage />;
}
