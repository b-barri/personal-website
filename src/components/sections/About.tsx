import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CatalogLabel from "@/components/ui/CatalogLabel";

// The About section is a single illustrated "postcard" artifact, rendered as an
// image by deliberate choice (the hand-drawn engraving/ink quality reads more
// original than HTML can). To offset the usual cost of text-in-an-image, the
// section keeps a real <h2> heading and a structured sr-only summary so the
// content stays indexable and screen-reader accessible.

export default function About() {
  return (
    <section id="about" className="bg-bg-surface py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <CatalogLabel number="02" className="mb-6">
            Return Address
          </CatalogLabel>
          <h2 className="mb-10 font-[family-name:var(--font-playfair)] text-4xl font-normal leading-[1.05] tracking-tight text-text-primary md:mb-14 md:text-6xl">
            The work is the point.
          </h2>

          <figure className="relative mx-auto overflow-hidden rounded-[4px] shadow-[0_34px_80px_-34px_rgba(0,0,0,0.7)]">
            <Image
              src="/images/about/postcard.png"
              alt="An aged airmail postcard titled “Post Card — About me”, laid out as a sheet of passport stamps summarizing Bhavya Barri's career and interests."
              width={1536}
              height={1024}
              sizes="(max-width: 1152px) 100vw, 1104px"
              className="h-auto w-full"
            />

            {/* Portrait affixed as a postage stamp over the postcard's printed
                "place stamp here" box (top-right). Positioned as a percentage of
                the image so it tracks the postcard at every width. */}
            <div
              className="absolute rotate-[-5deg]"
              style={{ left: "88.6%", top: "3.5%", width: "8.7%" }}
            >
              <div className="stamp-paper relative aspect-square shadow-[0_3px_9px_-3px_rgba(40,32,22,0.55)]">
                <div className="absolute inset-[12%] overflow-hidden">
                  <Image
                    src="/images/about.jpg"
                    alt="Bhavya Barri"
                    fill
                    sizes="120px"
                    className="object-cover"
                    style={{ transform: "scale(1.85)", transformOrigin: "54% 30%" }}
                  />
                </div>
              </div>
            </div>
          </figure>

          {/* Same content as machine-readable text — keeps the section indexable
              and accessible even though the artifact itself is an image. */}
          <div className="sr-only">
            <p>
              About Bhavya Barri — biotech engineer turned product builder. A
              product builder because I couldn&apos;t stop noticing what was broken.
            </p>
            <p>
              Product work across Groww and CRED: search and understanding user
              intent; engagement and making finance feel human; AI-driven
              information routing, getting the right information to the right
              person before they ask; and commerce, merging discovery and
              purchase into one motion.
            </p>
            <p>
              Driven by one question: what actually endures? Software expires,
              trust accumulates. An interface that looks great today looks dated
              in ten years, but the community around a product, the problem it
              stands for, and the trust it builds outlast the UI.
            </p>
            <p>
              Off the clock: home barista, heavy reader, Substack writer, and
              sketcher — a reader, writer, maker, and collector of interesting
              ideas.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
