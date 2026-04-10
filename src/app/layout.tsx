import type { Metadata } from "next";
import { spaceGrotesk, inter } from "@/lib/fonts";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
