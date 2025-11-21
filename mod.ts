import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { Parent, Root } from "mdast";
import type { Context, ConverterOptions, HandlersMap, TraverseFn } from "./src/types.ts";
import { handlers } from "./src/handlers.ts";

const DEFAULT_OPTIONS = {
  olSeparator: ".",
  ulMarker: "•",
  imgMarker: "🖼",
  thematicBreak: "▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
  headingEmojis: {
    h1: "📌",
    h2: "✏️",
    h3: "📚",
    h4: "🔖",
    h5: "🔹",
    h6: "🔸",
  },
};

const traverse: TraverseFn = (nodes, ctx) => {
  return nodes
    .map((node) => {
      const handler = ctx.handlers[node.type];
      if (handler) return handler(node, ctx, traverse);
      // if there is no handler, but there are children, we go deeper
      if ("children" in node) return traverse((node as Parent).children, ctx);
      return "";
    })
    // at the top level (0) we break off blocks, inside (1+) we glue
    .join(ctx.joinSeparator ?? (ctx.indentLevel === 0 ? "\n\n" : ""));
};

/**
 * Converts Markdown text into Telegram's MarkdownV2 format.
 *
 * It uses the 'unified' engine with 'remark-parse' and 'remark-gfm'
 * to create an Abstract Syntax Tree (AST), which is then traversed
 * and rendered according to custom Telegram-specific rules.
 *
 * @param markdown The raw Markdown string to be converted.
 * @param options Optional settings to customize markers, separators, and heading emojis.
 * @param customHandlers Optional map of handlers to override default conversion logic for specific AST node types (e.g., 'link', 'paragraph').
 * @returns The converted string formatted for Telegram MarkdownV2.
 */
export function converter(
  markdown: string,
  options: ConverterOptions = {},
  customHandlers: HandlersMap = {},
): string {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const activeHandlers = { ...handlers, ...customHandlers };

  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(markdown) as Root;

  const context: Context = {
    options: mergedOptions as Required<ConverterOptions>,
    indentLevel: 0,
    handlers: activeHandlers,
  };

  return traverse([tree], context).trim();
}
