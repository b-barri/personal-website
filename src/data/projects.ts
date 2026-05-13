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
  hasFullContent?: boolean; // true if a markdown file exists in src/content/projects/
}

export const projects: Project[] = [
  {
    slug: "mockingbird",
    title: "Mockingbird",
    tagline:
      "A senior PM interviewer that lives in your laptop — voice-first, tension-aware",
    description:
      "A voice-based PM interview practice tool built in a weekend. You pick a case, Alex (the AI interviewer) reads it, you talk through your answer, and afterward you get the kind of feedback a real senior PM would give — anchored to specific moments, grounded in the case's named tensions, with no checklist grading. The case bank is 30 cases deep, ~70% India-context (UPI, Swiggy, Blinkit, IRCTC tatkal, Zerodha onboarding). The voice layer is provider-pluggable so the same product can run on Sarvam Bulbul + Saaras or Cartesia Sonic + Ink-Whisper — the architecture is an empirical testbed for Indic-native voice. BYO API keys, 187 tests green, decision history readable as a PR.",
    imagePath: "/images/projects/interview.png",
    tools: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Anthropic Claude Sonnet 4.6",
      "Sarvam Bulbul + Saaras",
      "Cartesia Sonic + Ink-Whisper",
      "Vitest",
      "Playwright",
      "Vercel",
      "Claude Code",
      "Midjourney",
    ],
    features: [
      "Tension-grounded feedback — eval rubric is the case's named trade-offs, not a generic framework checklist",
      "30 Product Design cases, ~70% India-context (UPI, Swiggy, Blinkit, IRCTC, Zerodha)",
      "Voice-first session with provider-pluggable layer (Sarvam or Cartesia) behind one abstraction",
      "BYO API keys — no server-side cost, no PII storage, 90-second onboarding",
      "Dimension cards + tension prose feedback — scannable without going numeric",
    ],
    links: {
      demo: "https://mockingbird-chi.vercel.app",
      github: "https://github.com/b-barri/mockingbird",
      other: [
        {
          label: "PR walkthrough",
          url: "https://github.com/b-barri/mockingbird/pull/1",
        },
      ],
    },
    featured: true,
    hasFullContent: true,
  },
  {
    slug: "literary-garden",
    title: "Literary Garden",
    tagline:
      "A digitized intellectual orbit — Kindle highlights and vocabulary, grown as a private garden",
    description:
      "A static-site 'garden' for your own Kindle reading — a spaced-repetition flashcard bed for vocabulary you looked up, and a scrapbook of passages you highlighted, surfaced as shareable postcards. Built in a weekend with Claude Code, reading directly from Kindle's on-device vocab.db (SQLite) and My Clippings.txt. Private by construction: nothing leaves your laptop unless you choose to deploy it. Words move through three states — seedling, bloom, pressed — driven by FSRS spaced-repetition. The scrapbook shows every highlighted book on a 3D-hinge spine carousel with the dominant spine color extracted from each cover, and any quote exports as a 1080×1350 watercolor share card. Open-sourced as a clonable template.",
    imagePath: "/images/projects/Kindle_garden.png",
    tools: [
      "Astro 6",
      "Svelte 5",
      "Tailwind CSS",
      "TypeScript",
      "better-sqlite3",
      "sharp",
      "ts-fsrs",
      "html-to-image",
      "Claude Code",
    ],
    features: [
      "Reads Kindle's on-device vocab.db and My Clippings.txt — no servers, no accounts",
      "FSRS spaced-repetition with state-as-aesthetic: seedling → bloom → pressed",
      "3D-hinge spine carousel; dominant spine color extracted from each cover",
      "Watercolor share cards (1080×1350) exported via html-to-image",
      "Open-source template — clone it, drop in your Kindle files, deploy",
    ],
    links: {
      github: "https://github.com/b-barri/literary-garden",
    },
    featured: true,
    hasFullContent: true,
  },
  {
    slug: "prd-auditor",
    title: "PRD Auditor",
    tagline:
      "AI PRD auditor that stress-tests your product strategy like a panel of experts",
    description:
      "An AI-powered PRD auditor built on Lenny Rachitsky's content. Paste a PRD and get it scored, critiqued, and rewritten by AI grounded in insights from 279 real product experts (Shreyas Doshi, Teresa Torres, Marty Cagan, and more). Processed 289 podcast transcripts and 349 newsletter articles into a structured knowledge base, built a Next.js app with a two-tier Claude API strategy, and shipped in one day using a compound engineering workflow. Three distinct feedback modes: scorecard analysis with inline annotations, expert debate where matched experts argue your strategy, and framework-organized expert review. Features a pixel-art game UI with 279 collectible expert avatars.",
    imagePath: "/images/projects/prd-auditor.webp",
    tools: [
      "Next.js 16",
      "Claude Sonnet 4",
      "Claude Haiku 4.5",
      "Zustand",
      "Tailwind CSS v4",
      "GSAP",
      "Zod 4",
      "Vercel",
    ],
    features: [
      "Three feedback modes: scorecard, expert debate, and framework review",
      "Knowledge base from 289 podcasts and 349 newsletter articles",
      "279 indexed product experts with AI-generated pixel-art avatars",
      "Inline annotations that teach frameworks before applying them",
      "Built in a single day with compound engineering workflow",
    ],
    links: {
      demo: "https://lenny-war-room.vercel.app/",
      github: "https://github.com/b-barri/lenny-prd-auditor",
    },
    featured: true,
  },
  {
    slug: "project-dora",
    title: "Project Dora",
    tagline:
      "AI writing pipeline that generates content in your personal voice",
    description:
      "A full AI-powered Substack blog generation pipeline with human approval gates at every step. Turns real-time trend signals from 9 sources (Stratechery, Every.to, Hacker News, Twitter, TechCrunch, Reddit, Google Trends, and more) into polished, fact-checked posts written in the author's own voice. A 7-stage pipeline handles ingestion, two-pass topic generation with strategic framework overlays, web research, section-by-section drafting with tone fingerprinting, and automated fact-checking with citation injection. Built over 18 days with 84 commits. End-to-end blog posts in ~15 minutes that pass the 'did I write this?' test.",
    imagePath: "/images/projects/project-dora.webp",
    tools: [
      "Python",
      "FastAPI",
      "SQLAlchemy 2.0",
      "SQLite (WAL)",
      "Claude Sonnet",
      "Claude Haiku",
      "DALL-E 3",
      "Playwright",
      "Jinja2",
    ],
    features: [
      "7-stage pipeline with human approval gates at every step",
      "9 trend sources with slot-based priority aggregation",
      "Tone fingerprinting from existing writing for authentic voice matching",
      "Automated fact-checking with source cross-referencing and citations",
      "Feedback loop from approve/reject history that improves over time",
    ],
    links: {
      github: "https://github.com/b-barri/ProjectDora",
    },
    featured: true,
  },
  {
    slug: "openclaw",
    title: "OpenClaw",
    tagline:
      "Open-source personal AI assistant deployed on Fly.io with Discord integration",
    description:
      "Deployed OpenClaw, an open-source personal AI assistant framework, on Fly.io with Discord integration. Connects to 20+ messaging channels (WhatsApp, Telegram, Discord, Slack, etc.) through a single gateway, routes conversations through a unified AI agent, and handles daily digests, async research, and recurring tasks. The architecture is gateway-centric with a WebSocket control plane. Channels are plugins, models are swappable (Anthropic, OpenAI, Google, Ollama with automatic failover). Key use cases include automated daily AI industry digests, blog topic suggestions, pre-meeting context briefs, and personal relationship tracking. Claude Code automated 80% of the deployment.",
    imagePath: "/images/projects/openclaw.webp",
    tools: [
      "TypeScript",
      "Node.js 22+",
      "Hono",
      "Fly.io",
      "Docker",
      "Claude Code",
      "Discord API",
    ],
    features: [
      "Unifies 20+ messaging channels through a single AI gateway",
      "Model flexibility with automatic failover across providers",
      "Real agency: browser control, shell commands, cron jobs",
      "Privacy-first: runs locally, single-user, data stays on your hardware",
      "Persistent memory through daily logs and identity files",
    ],
    links: {
      other: [
        {
          label: "Blog Post",
          url: "https://bhavya287274.substack.com/p/i-ran-openclaw-for-a-day-heres-what",
        },
      ],
    },
    featured: false,
  },
  {
    slug: "todo-list",
    title: "ToDo List",
    tagline:
      "Task management system built entirely as natural language Claude Code skills",
    description:
      "A daily task management system that lives inside Claude Code's CLI, built entirely as natural language instructions with no traditional code, no dependencies, and no build step. Six slash commands (/todo:plan, /todo:add, /todo:show, /todo:update, /todo:done, /todo:review) map to the natural rhythm of a workday: morning planning, during-work tracking, and end-of-day review. The entire system is ~400 lines of 'instruction code' written as English prose in markdown files with YAML frontmatter. Tasks are stored as structured markdown under ~/.claude/todo/, with completed tasks archived to dated files. Each command declares scoped tool permissions for safety.",
    imagePath: "/images/projects/todo-list.webp",
    tools: ["Claude Code CLI", "Markdown", "YAML"],
    features: [
      "Six slash commands mapping to morning/during/evening workflow rhythm",
      "Zero external dependencies — natural language as source code",
      "Scoped tool permissions per command for safety",
      "Swiss-style terminal output with box-drawing characters",
      "Daily archiving creates built-in work journal for standups",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "resume-editor-skill",
    title: "Resume Editor Skill",
    tagline:
      "Claude skill that turns job descriptions into submission-ready resumes in minutes",
    description:
      "A Claude Code skill that optimizes resumes for specific job descriptions, generates cover letters, and creates formatted Google Docs — all conversationally in under 5 minutes. Replaced a 500-line Python pipeline with a 230-line SKILL.md. Invoked with /resume-optimizer [JD URL], it fetches the job description (WebFetch with browser automation fallback for LinkedIn), reorders bullets by relevance using Claude's native reasoning, generates cover letters in both formal and email styles, writes a markdown review file, and creates a perfectly formatted Google Doc via copy-template strategy. The key insight: resume optimization is a reasoning task, not an algorithmic one.",
    imagePath: "/images/projects/resume-editor-skill.webp",
    tools: ["Claude Code (Opus)", "SKILL.md", "WebFetch", "Google Workspace CLI"],
    features: [
      "Conversational resume optimization — one command to formatted Google Doc",
      "Intelligent JD-to-resume matching using Claude's native reasoning",
      "Silent fallback chain: WebFetch, browser automation, manual paste",
      "Cover letter generation in formal and email styles",
      "Pixel-perfect Google Doc output via copy-template strategy",
    ],
    links: {},
    featured: true,
  },
  {
    slug: "prosepect",
    title: "Prosepect",
    tagline:
      "AI-powered book research assistant that helps you decide what to read next",
    description:
      "A book research assistant that goes beyond simple recommendations. It analyzes books across multiple dimensions — writing style, key themes, reader reviews, author background — to help you make informed reading decisions. Think of it as a well-read friend who can tell you exactly whether a book is worth your time, with deep analysis rather than surface-level star ratings.",
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
    tagline:
      "AI-powered tool that generates custom cover images for Notion pages",
    description:
      "An AI-powered Notion cover image generator (called 'Notion Pixie Doodler') that creates beautiful, cohesive illustrations in a distinctive minimalist Japanese watercolor style. Generates custom 1500x600px cover images based on blog title and description, featuring a charming character interacting with elements related to the content. All covers maintain a consistent aesthetic: delicate black ink line art with soft pink watercolor touches on white backgrounds, optimized for Notion's cover format with proper spacing for page icons. Uses Google Gemini models via Lovable AI Gateway edge functions for image generation.",
    imagePath: "/images/projects/notion-cover-generator.webp",
    tools: [
      "React 18",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Google Gemini",
      "Lovable",
      "Supabase",
    ],
    features: [
      "Generates custom 1500x600px Notion cover images from title and description",
      "Consistent minimalist Japanese watercolor art style across all covers",
      "AI-powered image generation using Google Gemini",
      "Optimized for Notion's cover format with icon spacing",
      "No design skills needed — instant professional covers",
    ],
    links: {
      demo: "https://notion-pixie-doodler.lovable.app/",
    },
    featured: false,
  },
  {
    slug: "resume-optimizer-v0",
    title: "Resume Optimizer v0",
    tagline:
      "Claude agent skill that tailors resumes to specific job descriptions",
    description:
      "The predecessor to the v1 Resume Editor Skill — a Python-based pipeline that tailors resumes to specific job descriptions. Analyzes job postings to extract key requirements, scores and reorders resume bullets by relevance using a keyword-matching algorithm (+2.0 per skill match, +0.5 for leadership verbs, weighted by requirement importance), and provides detailed skills gap analysis for interview preparation. The tool never changes facts, dates, or metrics — it only reorders and emphasizes existing content. Supports PDF and DOCX input, fetches job postings from URLs, and outputs with comprehensive change tracking reports.",
    imagePath: "/images/projects/resume-optimizer-v0.webp",
    tools: [
      "Python 3.9+",
      "pdfplumber",
      "python-docx",
      "BeautifulSoup4",
      "Google Docs API",
      "Claude Code",
    ],
    features: [
      "AI-powered JD analysis extracting requirements and competencies",
      "Relevance scoring algorithm that reorders bullets by job importance",
      "Data integrity guarantee — never changes facts, dates, or metrics",
      "Format preservation via manual update instructions",
      "Comprehensive skills gap analysis with interview prep",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "contentflow",
    title: "ContentFlow",
    tagline:
      "Content planning and workflow tool for YouTube creators",
    description:
      "A content planning and workflow tool for YouTube creators that solves the fragmented workflow of jumping between tools for transcription, SEO-friendly metadata, and thumbnail design. Auto-generates clean transcripts, multiple title/description options, and customizable thumbnails — all in one place with no context-switching. The system can be seeded with past high-performing titles and descriptions so suggestions match the creator's voice and audience. Ensures consistent branding across videos by locking in brand language, color palettes, and text styles.",
    imagePath: "/images/projects/contentflow.webp",
    tools: ["Cursor", "Claude Code", "Vercel"],
    features: [
      "Auto-generate transcripts, SEO titles, and thumbnails in one workflow",
      "Consistent brand enforcement with locked styles and palettes",
      "Personalized suggestions seeded from past high-performing content",
      "Transcript-powered captions for SEO and accessibility",
      "Safer publishing defaults with auto-filled metadata",
    ],
    links: {
      demo: "https://content-creator-tool.vercel.app/",
    },
    featured: true,
  },
  {
    slug: "book-review-tool",
    title: "Book Review Tool",
    tagline:
      "Generates visual book review presentations using the Gamma API",
    description:
      "A tool that transforms reading notes into beautiful, shareable presentation documents via the Gamma API. Supports two modes: Book Club Recap for group discussion notes, and Personal Review for individual thoughts. Collects the book title, author, reading notes, document vibe (e.g., Modern), image style (e.g., Photorealistic), and reading progress percentage, then generates a polished, shareable presentation. Sample outputs include reviews of 'Small Things Like These' by Claire Keegan and 'Dune' by Frank Herbert.",
    imagePath: "/images/projects/book-review-tool.webp",
    tools: ["Gamma API", "React"],
    features: [
      "Transform reading notes into visual presentation documents",
      "Two modes: Personal Review and Book Club Recap",
      "Customizable document vibe and image style settings",
      "Reading progress tracking integrated into reviews",
      "AI-powered presentation generation via Gamma API",
    ],
    links: {},
    featured: false,
  },
  {
    slug: "news-pull-based",
    title: "News (Pull Based)",
    tagline:
      "Pull-based news feed for stock movers and trending business news in India",
    description:
      "A pull-based news aggregator focused on Indian stock market movers and trending business news. Instead of a push-based notification firehose, it lets you pull news on demand — focused on what moved the markets today and why. Built for investors who want signal, not noise. Features curated financial news retrieval with on-demand access to stock movers and trending business stories.",
    imagePath: "/images/projects/news-pull-based.webp",
    tools: [],
    features: [
      "Pull-based model for on-demand financial news",
      "Coverage of Indian stock movers and market trends",
      "Curated business news filtering for signal over noise",
      "Market context for each story",
    ],
    links: {},
    featured: false,
  },
];
