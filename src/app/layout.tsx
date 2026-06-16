import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { spaceGrotesk, inter, playfairDisplay, ibmPlexMono, caveat } from "@/lib/fonts";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bhavya-barri-portfolio.vercel.app"),
  title: "Bhavya Barri — Side Quests",
  description:
    "Side projects are how I think. These are the ones that made it out. Portfolio of AI tools, Claude skills, and creative side projects by Bhavya Barri.",
  openGraph: {
    title: "Bhavya Barri — Side Quests",
    description:
      "Side projects are how I think. These are the ones that made it out.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavya Barri — Side Quests",
    description:
      "Side projects are how I think. These are the ones that made it out.",
  },
};

// Anti-FOUC: apply theme class before React hydrates
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${playfairDisplay.variable} ${ibmPlexMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <a href="#main" className="skip-to-content">
            Skip to content
          </a>
          <ScrollProgress />
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
