export interface Writing {
  title: string;
  description: string;
  url: string;
  platform: string;
}

export const writings: Writing[] = [
  {
    title: "Bhavya on Substack",
    description:
      "Essays on building with AI, product strategy, and shipping side projects in public.",
    url: "https://barribhavya.substack.com/",
    platform: "Substack",
  },
  {
    title: "Bhavya on Medium",
    description:
      "Long-form writing on product management, AI tools, and lessons from building.",
    url: "https://bhavyabarri.medium.com/",
    platform: "Medium",
  },
];
