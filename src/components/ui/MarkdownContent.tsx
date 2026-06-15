"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkGloss from "@/lib/remark-gloss";
import GlossTerm from "@/components/ui/GlossTerm";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold text-text-primary mt-12 md:mt-16 mb-5 md:mb-6 first:mt-0 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-3xl font-bold text-text-primary mt-12 md:mt-16 mb-4 md:mb-5 leading-tight border-b border-border pb-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-[family-name:var(--font-heading)] text-lg md:text-2xl font-semibold text-text-primary mt-8 md:mt-10 mb-3 md:mb-4 leading-snug">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="font-[family-name:var(--font-heading)] text-base md:text-lg font-semibold text-text-primary mt-6 md:mt-8 mb-2 md:mb-3">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-text-primary text-[15px] md:text-lg leading-[1.7] md:leading-[1.75] mb-5 md:mb-6">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-accent font-medium underline decoration-accent/30 underline-offset-2 hover:decoration-accent transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-text-primary">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-6 space-y-2.5 ml-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-6 space-y-2.5 ml-1 list-decimal list-inside marker:text-accent marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-text-primary text-base md:text-lg leading-[1.7] pl-2 relative before:content-['→'] before:absolute before:left-[-1.25rem] before:text-accent before:font-bold list-none">
      {children}
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-8 pl-6 py-2 border-l-4 border-accent bg-bg-surface/50 rounded-r-lg">
      <div className="text-text-primary text-lg italic font-[family-name:var(--font-heading)]">
        {children}
      </div>
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-[0.9em] font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="text-text-on-dark font-mono text-sm leading-relaxed">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-8 p-5 bg-bg-dark rounded-xl overflow-x-auto border border-bg-dark">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-bg-surface border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-bg-surface/40 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-text-primary text-sm uppercase tracking-wide font-[family-name:var(--font-heading)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-text-primary text-base align-top">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
  ),
  // Glossary terms: [[term::explanation]] -> <abbr> (see lib/remark-gloss.ts)
  abbr: ({ children, title }) => <GlossTerm title={title}>{children}</GlossTerm>,
  img: ({ src, alt, title }) => {
    const url = typeof src === "string" ? src : "";
    // `![alt](src "caption")` -> rendered caption under the image.
    // Uses block-styled spans, not <figure>, so it stays valid inside the
    // <p> react-markdown wraps lone images in (avoids hydration mismatch).
    const withCaption = (node: React.ReactNode) =>
      title ? (
        <span className="my-8 block">
          {node}
          <span className="mt-3 block text-center text-sm italic text-text-secondary">
            {title}
          </span>
        </span>
      ) : (
        node
      );
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/
    );
    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      return (
        <div className="my-8 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={alt || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full rounded-xl shadow-md border-0"
          />
        </div>
      );
    }
    const videoMatch = url.match(/\.(mp4|mov|webm)(?:[?#]|$)/i);
    if (videoMatch) {
      const ext = videoMatch[1].toLowerCase();
      const type =
        ext === "webm"
          ? "video/webm"
          : ext === "mov"
            ? "video/quicktime"
            : "video/mp4";
      const isPhoneFrame = /[?#&]phone(?:&|$)/i.test(url);
      const cleanUrl = url.replace(/#.*$/, "");
      const video = (
        <video
          aria-label={alt || ""}
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="metadata"
          className={
            isPhoneFrame
              ? "block w-full h-auto rounded-[2rem]"
              : "my-8 rounded-xl shadow-md w-full"
          }
        >
          <source src={cleanUrl} type={type} />
        </video>
      );
      if (isPhoneFrame) {
        return (
          <div className="my-8 flex justify-center">
            <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl w-full max-w-[280px]">
              {video}
            </div>
          </div>
        );
      }
      return video;
    }
    return withCaption(
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={alt || ""}
        className={`${title ? "block" : "my-8"} rounded-xl shadow-md w-full`}
      />
    );
  },
};

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <article className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkGloss]} components={components}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
