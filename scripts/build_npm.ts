import { build, emptyDir } from "@deno/dnt";
import denoJson from "../deno.json" with { type: "json" };
await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  typeCheck: false,
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  test: false,
  importMap: "deno.json",
  package: {
    name: "tg-markdown-converter",
    version: denoJson.version,
    description: "A robust, AST-based converter from Markdown to Telegram MarkdownV2",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ghotriw/tg-markdown-converter.git",
    },
    bugs: {
      url: "https://github.com/ghotriw/tg-markdown-converter/issues",
    },
    keywords: [
      "telegram",
      "markdown",
      "markdownv2",
      "unified",
      "ast",
      "converter",
    ],
    sideEffects: false,
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
