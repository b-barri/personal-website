export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  imagePath: string;
  tools: string[];
  features: string[];
  links: {
    demo?: string;
    github?: string;
    other?: { label: string; url: string }[];
  };
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "prd-auditor",
    title: "PRD Auditor",
    tagline: "AI PRD auditor that stress-tests your product strategy like a panel of experts",
    description:
      "An AI-powered PRD auditor built on top of Lenny's newsletter frameworks. It takes your product requirement document and evaluates it from multiple expert perspectives — product strategy, engineering feasibility, user experience, and business impact. Think of it as a panel of seasoned product leaders reviewing your PRD before you ship it to your team.",
    imagePath: "/images/projects/prd-auditor.webp",
    tools: [],
    features: [
      "Multi-perspective PRD analysis",
      "Strategy stress-testing based on Lenny's frameworks",
      "Actionable feedback with severity ratings",
      "Export-ready review summaries",
    ],
    links: {},
    featured: true,
  },
  {
    slug: "project-dora",
    title: "Project Dora",
    tagline: "AI writing pipeline that generates content in your personal voice",
    description:
      "A personal writing assistant that learns your voice, tone, and style from your existing writing. It helps generate drafts, blog posts, and social content that sounds authentically like you — not like generic AI output. Built as a full pipeline from topic research to final draft.",
    imagePath: "/images/projects/project-dora.webp",
    tools: [],
    features: [
      "Voice and style learning from your existing writing",
      "Topic research and outline generation",
      "Multi-draft generation with style consistency",
      "Content pipeline from idea to published post",
    ],
    links: {},
    featured: true,
  },
  {
    slug: "openclaw",
    title: "OpenClaw",
    tagline: "Open-source claw machine controller setup and configuration",
    description:
      "An open-source hardware and software setup for building and controlling a claw machine. Includes controller configuration, motor calibration, and a game interface. A fun hardware-meets-software side project that combines physical computing with web interfaces.",
    imagePath: "/images/projects/openclaw.webp",
    tools: [],
    features: [
      "Hardware controller configuration",
      "Motor calibration and testing",
      "Web-based game interface",
      "Open-source setup documentation",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "todo-list",
    title: "ToDo List",
    tagline: "Task management app with Claude Code workflow integration",
    description:
      "A task management application designed to integrate seamlessly with the Compound Engineering Claude Code workflow. Manages tasks, tracks progress, and integrates with AI-powered development pipelines for a streamlined builder workflow.",
    imagePath: "/images/projects/todo-list.webp",
    tools: ["Claude Code"],
    features: [
      "Claude Code workflow integration",
      "Task creation and progress tracking",
      "Priority-based task management",
      "Developer-focused workflow",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "resume-editor-skill",
    title: "Resume Editor Skill",
    tagline: "Claude skill that turns job descriptions into submission-ready resumes in minutes",
    description:
      "A Claude Code skill that takes a job description and your base resume, then intelligently tailors your resume to match the role. It rewrites bullet points, emphasizes relevant experience, and adjusts keywords — producing a submission-ready resume in minutes instead of hours.",
    imagePath: "/images/projects/resume-editor-skill.webp",
    tools: ["Claude Code"],
    features: [
      "Job description parsing and keyword extraction",
      "Intelligent resume tailoring",
      "Bullet point rewriting for relevance",
      "Submission-ready PDF output",
    ],
    links: {},
    featured: true,
  },
  {
    slug: "prosepect",
    title: "Prosepect",
    tagline: "AI-powered book research assistant that helps you decide what to read next",
    description:
      "A book research assistant that goes beyond simple recommendations. It analyzes books across multiple dimensions — writing style, key themes, reader reviews, author background — to help you make informed reading decisions. Think of it as a well-read friend who can tell you exactly whether a book is worth your time.",
    imagePath: "/images/projects/prosepect.webp",
    tools: [],
    features: [
      "Multi-dimensional book analysis",
      "Writing style and theme evaluation",
      "Reader sentiment synthesis",
      "Personalized reading recommendations",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "notion-cover-generator",
    title: "Notion Cover Generator",
    tagline: "AI-powered tool that generates custom cover images for Notion pages",
    description:
      "A tool that generates beautiful, custom cover images for your Notion pages using AI. Input a page title or description and get a perfectly sized cover image that matches your aesthetic. Built with Lovable for rapid prototyping.",
    imagePath: "/images/projects/notion-cover-generator.webp",
    tools: ["Lovable"],
    features: [
      "AI-generated cover images",
      "Notion-optimized sizing",
      "Style customization options",
      "One-click generation",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "resume-optimizer-v0",
    title: "Resume Optimizer v0",
    tagline: "Claude agent skill that tailors resumes to specific job descriptions",
    description:
      "The original version of the resume optimization skill. A Claude Code agent that takes your resume and a target job description, then produces a tailored version optimized for ATS systems and human reviewers alike.",
    imagePath: "/images/projects/resume-optimizer-v0.webp",
    tools: ["Claude Code"],
    features: [
      "ATS-optimized formatting",
      "Keyword alignment with job descriptions",
      "Experience relevance scoring",
      "Multiple output formats",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "contentflow",
    title: "ContentFlow",
    tagline: "Content planning and workflow tool for YouTube creators",
    description:
      "A content planning and workflow management tool built specifically for YouTube creators. Helps plan content calendars, track video production stages, manage scripts, and optimize publishing schedules. Built with Cursor and Claude Code.",
    imagePath: "/images/projects/contentflow.webp",
    tools: ["Cursor", "Claude Code"],
    features: [
      "Content calendar planning",
      "Video production stage tracking",
      "Script management",
      "Publishing schedule optimization",
    ],
    links: {},
    featured: true,
  },
  {
    slug: "book-review-tool",
    title: "Book Review Tool",
    tagline: "Generates visual book review presentations using the Gamma API",
    description:
      "A tool that takes your book notes and thoughts, then generates polished visual book review presentations using the Gamma API. Perfect for sharing book reviews on social media or with reading groups in a visually engaging format.",
    imagePath: "/images/projects/book-review-tool.webp",
    tools: ["Gamma API"],
    features: [
      "Automated visual presentation generation",
      "Gamma API integration",
      "Book notes to visual review pipeline",
      "Social-media-ready output",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "news-pull-based",
    title: "News (Pull Based)",
    tagline: "Pull-based news feed for stock movers and trending business news in India",
    description:
      "A pull-based news aggregator focused on Indian stock market movers and trending business news. Instead of a push-based firehose, it lets you pull news on demand — focused on what moved the markets today and why. Built for investors who want signal, not noise.",
    imagePath: "/images/projects/news-pull-based.webp",
    tools: [],
    features: [
      "Stock mover tracking for Indian markets",
      "Pull-based news model (on-demand, not firehose)",
      "Business news trending analysis",
      "Market context for each story",
    ],
    links: {},
    featured: false,
  },
];
