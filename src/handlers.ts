import type { Code, Heading, Html, Image, Link, List, ListItem, Nodes, Parent, Root, Text } from "mdast";
import type { HandlersMap, HeadingLevel } from "./types.ts";
import { escapeCode, escapeText, escapeUrl } from "./utils.ts";

export const handlers: HandlersMap = {
  // Root children join logic handled in traverse
  root: (node, ctx, traverse) => {
    return traverse((node as Root).children, { ...ctx, joinSeparator: "\n\n" })
      .trim();
  },

  text: (node) => escapeText((node as Text).value),

  paragraph: (node, ctx, traverse) => {
    return traverse((node as Parent).children, { ...ctx, joinSeparator: "" });
  },

  strong: (node, ctx, traverse) => {
    return `*${traverse((node as Parent).children, ctx)}*`;
  },

  emphasis: (node, ctx, traverse) => {
    return `_${traverse((node as Parent).children, ctx)}_`;
  },

  delete: (node, ctx, traverse) => {
    return `~${traverse((node as Parent).children, ctx)}~`;
  },

  inlineCode: (node) => {
    return `\`${escapeCode((node as Code).value)}\``;
  },

  code: (node) => {
    const codeNode = node as Code;
    const lang = codeNode.lang ? escapeText(codeNode.lang) : "";
    return `\`\`\`${lang}\n${escapeCode(codeNode.value)}\n\`\`\``;
  },

  heading: (node, ctx, traverse) => {
    const headingNode = node as Heading;
    const level = headingNode.depth;
    const headingMap = ctx.options.headingEmojis || {};
    const key = `h${level}` as HeadingLevel;
    const emojiValue = headingMap[key];
    const emoji = emojiValue ? escapeText(emojiValue) : "";
    const text = traverse(headingNode.children, ctx);
    return `*${emoji} ${text}*`;
  },

  link: (node, ctx, traverse) => {
    const text = traverse((node as Parent).children, ctx);
    const url = escapeUrl((node as Link).url);
    return `[${text}](${url})`;
  },

  image: (node, ctx) => {
    const img = node as Image;
    const alt = escapeText(img.alt || "Image");
    const url = escapeUrl(img.url);
    const marker = escapeText(ctx.options.imgMarker || "!");
    return `[${marker} ${alt}](${url})`;
  },

  blockquote: (node, ctx, traverse) => {
    const content = traverse((node as Parent).children, {
      ...ctx,
      joinSeparator: "\n\n",
    });
    return content
      .split("\n")
      .map((line) => (line ? `>${line}` : ">"))
      .join("\n");
  },

  list: (node, ctx, traverse) => {
    const list = node as List;
    const isOrdered = list.ordered;
    const start = list.start ?? 1;

    return list.children.map((item, index) => {
      const marker = isOrdered ? `${start + index}${ctx.options.olSeparator}` : ctx.options.ulMarker;

      const listItem = item as ListItem;
      const checked = listItem.checked;
      let prefix = "";
      if (checked === true) prefix = "[x] ";
      if (checked === false) prefix = "[ ] ";

      const indentSpaces = "  ".repeat(ctx.indentLevel);
      const prefixEscaped = escapeText(`${indentSpaces}${marker} ${prefix}`);
      const itemContent = traverse(item.children, {
        ...ctx,
        indentLevel: ctx.indentLevel + 1,
        joinSeparator: "\n",
      });

      return `${prefixEscaped}${itemContent.trim()}`;
    }).join("\n");
  },

  break: () => "\n",

  thematicBreak: (_node, ctx) => {
    return escapeText(ctx.options.thematicBreak);
  },

  table: (node, ctx, traverse) => {
    const tableContext = {
      ...ctx,
      joinSeparator: "\n",
      handlers: {
        ...ctx.handlers,
        text: (n: Nodes) => escapeCode((n as Text).value),
      },
    };

    const rows = traverse((node as Parent).children, tableContext);
    return `\`\`\`\n${rows}\n\`\`\``;
  },

  tableRow: (node, ctx, traverse) => {
    const cells = traverse((node as Parent).children, {
      ...ctx,
      joinSeparator: " | ",
    });
    return `| ${cells} |`;
  },

  tableCell: (node, ctx, traverse) => {
    return traverse((node as Parent).children, { ...ctx, joinSeparator: "" });
  },

  html: (node) => {
    return `\`${escapeCode((node as Html).value)}\``;
  },
};
