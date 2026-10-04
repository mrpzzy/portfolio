import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ContactModalProvider } from "@/components/ContactModal";

const SITE_URL = "https://juliusayuno.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Julius Baltazar Ayuno | AI Automation Engineer",
  description:
    "I turn business problems into working systems. AI automation engineer putting LLMs to work inside real operations, and building the databases, automations, and software underneath them.",
  openGraph: {
    title: "Julius Baltazar Ayuno | AI Automation Engineer",
    description:
      "I turn business problems into working systems. LLM integrations, AI agents, and the systems underneath them. Shipped in production.",
    type: "website",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Julius Baltazar Ayuno | AI Automation Engineer",
    description:
      "I turn business problems into working systems. LLM integrations, AI agents, and the systems underneath them.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <SmoothScroll>
          <ContactModalProvider>{children}</ContactModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
