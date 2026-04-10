import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center px-6">
        <h1 className="text-8xl font-bold font-[family-name:var(--font-heading)] text-accent mb-4">
          404
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          This side quest doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
