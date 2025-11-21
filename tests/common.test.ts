import { converter } from "../mod.ts";
import { assertEquals } from "@std/assert";

const inputMarkdown = await Deno.readTextFile("tests/fixtures/common.md");
const expectedTelegramMarkdown = await Deno.readTextFile("tests/fixtures/common.tg.md");

Deno.test("Should correctly convert standard Markdown to Telegram Markdown V2", () => {
  const actualResult = converter(inputMarkdown);
  assertEquals(actualResult.trim(), expectedTelegramMarkdown.trim());
});
