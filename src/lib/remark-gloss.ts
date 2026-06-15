// remark plugin: turns [[term::plain explanation]] into a glossary term that
// renders as an <abbr> carrying the explanation in `title`. MarkdownContent
// overrides `abbr` with the GlossTerm tooltip component.
//
// Authoring: write the jargon, tuck the plain-English meaning after `::`
//   "...built with [[Swift::Apple's language for Mac and iPhone apps]]..."

interface MdastNode {
  type: string;
  value?: string;
  children?: MdastNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

const GLOSS_RE = /\[\[([^\]|]+?)::([^\]]+?)\]\]/g;

function splitText(value: string): MdastNode[] {
  const out: MdastNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  GLOSS_RE.lastIndex = 0;
  while ((m = GLOSS_RE.exec(value)) !== null) {
    if (m.index > last) out.push({ type: "text", value: value.slice(last, m.index) });
    out.push({
      type: "gloss",
      data: {
        hName: "abbr",
        hProperties: { title: m[2].trim(), className: ["gloss-term"] },
      },
      children: [{ type: "text", value: m[1].trim() }],
    });
    last = m.index + m[0].length;
  }
  if (last < value.length) out.push({ type: "text", value: value.slice(last) });
  return out.length ? out : [{ type: "text", value }];
}

function walk(node: MdastNode): void {
  if (!Array.isArray(node.children)) return;
  const next: MdastNode[] = [];
  for (const child of node.children) {
    if (child.type === "text" && typeof child.value === "string" && child.value.includes("[[")) {
      next.push(...splitText(child.value));
    } else {
      walk(child);
      next.push(child);
    }
  }
  node.children = next;
}

export default function remarkGloss() {
  return (tree: MdastNode) => walk(tree);
}
