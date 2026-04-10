"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-headings:text-text-primary prose-p:text-text-primary prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-li:text-text-primary prose-code:text-accent prose-code:bg-bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-bg-dark prose-pre:text-text-on-dark prose-table:text-sm prose-th:text-text-primary prose-td:text-text-secondary prose-img:rounded-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
