*📌 Heading H1 \(ATX Style\)*

*✏️ Heading H2*

*📚 Heading H3*

*🔖 Heading H4*

*🔹 Heading H5*

*🔸 Heading H6*

*📌 Heading H1 \(Setext Style\)*

*✏️ Heading H2 \(Setext Style\)*

▬▬▬▬▬▬▬▬▬▬▬▬▬▬

*✏️ 1\. Text Formatting*

*Bold Text \(asterisks\)* and *Bold Text \(underscores\)*
_Italic Text \(asterisks\)_ and _Italic Text \(underscores\)_
_*Bold and Italic simultaneously*_
~Strikethrough Text~

*Nesting:*
This is *bold text, inside which there is _italic_ and `code`*\.
This is _italic text, inside which there is *bold* text_\.

*Complex Cases:*
H2O \(regular text\) vs H~2~O \(Subscript \- if supported\)

[example\.com](https://example.com)
[🖼 Tux, the Linux mascot](https://example.com)

▬▬▬▬▬▬▬▬▬▬▬▬▬▬

*✏️ 2\. Lists*

*📚 Unordered List*

• Item 1
• Item 2
  • Nested item 2\.1 \(2 spaces indent\)
  • Nested item 2\.2
    • Level 3

*📚 Ordered List*

1\. First Item
2\. Second Item
3\. Third Item
  1\. Nested Ordered 1
  2\. Nested Ordered 2
    • Mixed type \(bullet inside number\)

*📚 Task Lists \(GFM\)*

• \[x\] Completed task
• \[ \] Uncompleted task
• \[ \] *Bold* task

▬▬▬▬▬▬▬▬▬▬▬▬▬▬

*✏️ 3\. Code Blocks*

Inline code: use the function `console.log()` for output\.

*Fenced Code Block with Syntax Highlighting:*

```javascript
function test() {
  console.log("Hello, Markdown!");
  return true;
}
```

```html
<!-- HTML: <div id="msg"></div> -->
<script>
document.getElementById('msg').textContent = 'Hello, DOM!';
</script>
```