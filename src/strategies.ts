import type { Code, Parent } from "mdast";
import type { SplitStrategy } from "./types.ts";
import { chunkString, escapeCode, escapeText } from "./utils.ts";

/**
 * Strategy for splitting long code.
 * Cuts raw text contents and wraps each piece in ```...```
 */
export const splitCode: SplitStrategy = (node, _ctx, _traverse, limit) => {
  const codeNode = node as Code;
  const lang = codeNode.lang ? escapeText(codeNode.lang) : "";

  // Calculate overhead costs: ```lang\n ... \n```
  const wrapperOverhead = 3 + lang.length + 1 + 1 + 3;
  const maxContentLength = limit - wrapperOverhead;

  if (maxContentLength <= 0) return [];

  const rawChunks = chunkString(codeNode.value, maxContentLength);

  return rawChunks.map((chunk) => {
    return `\`\`\`${lang}\n${escapeCode(chunk)}\n\`\`\``;
  });
};

/**
 * Strategy for breaking up long quotes.
 * Splits a quote into separate paragraphs, each beginning with '>'.
 * This allows Telegram to break the message between paragraphs within the quote.
 */
export const splitBlockquote: SplitStrategy = (node, ctx, traverse, _limit) => {
  // A quotation consists of children (usually paragraphs)
  const children = (node as Parent).children;

  // We render each child separately, adding the quote formatting to it.
  // Important: we don't check the limit here; we're simply breaking the "monolith" into building blocks.
  // The orchestrator will decide how to package these building blocks.

  return children.map((child) => {
    // Render the interior (for example, a paragraph)
    const childContent = traverse([child], ctx);

    // Wrap it in a quote (like handler.blockquote does)
    return childContent
      .split("\n")
      .map((line) => (line ? `>${line}` : ">"))
      .join("\n");
  });
};

// Registry of strategies
export const splitStrategies: Record<string, SplitStrategy> = {
  code: splitCode,
  blockquote: splitBlockquote,
};
