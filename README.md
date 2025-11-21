# tg-markdown-converter

[![Deno](https://github.com/ghotriw/tg-markdown-converter/actions/workflows/deno.yml/badge.svg)](https://github.com/ghotriw/tg-markdown-converter/actions/workflows/deno.yml)
[![JSR Score](https://jsr.io/badges/@ghotriw/tg-markdown-converter/score)](https://jsr.io/@<scope>/<package>)
![](https://img.shields.io/badge/Compatibility-Bun-000000?logo=bun)
[![npm version](https://img.shields.io/npm/v/tg-markdown-converter.svg)](https://www.npmjs.com/package/tg-markdown-converter)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tg-markdown-converter)](https://bundlephobia.com/package/tg-markdown-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

A robust, **AST-based converter** that transforms standard Markdown (and GFM) into **Telegram's MarkdownV2** format.

## 🚀 Features

- **AST-Driven**: Powered by `remark-parse` and `remark-gfm`.
- **Configurable**: Customize bullet points, heading styles, and separators.
- **Safe Escaping**: Context-aware escaping logic (separate rules for plain text, code, and URLs).

## 📦 Installation

### Usage in Deno (JSR)

```bash
deno add jsr:@ghotriw/tg-markdown-converter
```

### Usage in Node.js (NPM)

```bash
npm install tg-markdown-converter
# or
yarn add tg-markdown-converter
# or
pnpm add tg-markdown-converter
```

### Usage in Bun

```bash
bun add tg-markdown-converter
```

## ⚡ Quick Start

```ts
import { converter } from 'tg-markdown-converter';

const markdown = `
# Hello World
Check out this [link](https://example.com).
- Item 1
- Item 2
`;

const telegramSafe = converter(markdown);

console.log(telegramSafe);
// Output:
// *⭐️ HELLO WORLD*
// Check out this [link](https://example.com)\.
// • Item 1
// • Item 2
```

## ⚙️ Configuration

```ts
const options = {
  
  olSeparator: ')',  // 1) instead of 1.
  ulMarker: '-',     // Use dashes instead of dots
  imgMarker: '🎨',   // 🎨 instead of 🖼
  thematicBreak: '* * *',
  headingEmojis: {
    h1: '🔥',
    h2: '✨',
    // ...
  }
};

converter(myMarkdown, options);
```

| Option          | Type     | Default          |
|-----------------|----------|------------------|
| `olSeparator`   | `string` | `.`              |
| `ulMarker`      | `string` | `•`              |
| `imgMarker`     | `string` | `🖼`.            |
| `thematicBreak` | `string` | `▬▬▬▬▬▬▬▬▬▬▬▬▬▬` |
| `headingEmojis` | `Record<h1...h6, string>` | `{ h1: 📌, h2: ✏️, ... }` |

## 🧑‍💻 Advanced Usage (Extensibility)

The library uses a Visitor Pattern, allowing users to override the rendering logic for any node type (e.g., `heading`, `link`, `table`) by passing custom handler functions. This is useful for specific formatting tweaks or supporting custom Markdown extensions.

For example, to convert **bold** text (`**text**`) into Telegram's *italic* (`_text_`), you can override the `strong` handler:

```ts
import { converter } from 'tg-markdown-converter';
import type { HandlersMap } from 'tg-markdown-converter/dist/types'; // Import types for safety

// 1. Define a custom handler map
const customHandlers: HandlersMap = {
  // Override the 'strong' node renderer
  strong: (node, ctx, traverse) => {
    // 2. Use underscore for italic instead of asterisk for bold
    return `_${traverse((node as any).children, ctx)}_`;
  },

  // You can also add handlers for types not covered by default (e.g., 'customElement')
};

const markdown = "This is **important** text.";

// 3. Pass the custom handlers object to the converter
const result = converter(markdown, {}, customHandlers);

console.log(result);
// Output:
// "This is _important_ text\."
```

## 🧪 Run tests:

```Bash
deno task test
```

## 📜 License

[MIT ©](./LICENSE)
