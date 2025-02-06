import React from "react";

function Renderer({ text }: { text: string }) {
  // console.log(text);

  // Function to process Slack-style formatting manually
  const formatSlackText = (text: string): string => {
    // Escape HTML to prevent accidental rendering
    text = text
      ?.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    // .replace(/"/g, "&quot;")
    // .replace(/'/g, "&#39;");

    // Handle multi-line code blocks: ```code``` => <pre><code>code</code></pre>
    text = text?.replace(/```([\s\S]+?)```/g, (match, codeBlock) => {
      return `<pre><code>${codeBlock}</code></pre>`;
    });

    // Handle inline code: `code` => <code>code</code>
    text = text?.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Handle bold: *text* => <strong>text</strong>
    text = text?.replace(/\*(.*?)\*/g, "<strong>$1</strong>");

    // Handle italic: _text_ => <em>text</em>
    text = text?.replace(/_(.*?)_/g, "<em>$1</em>");

    // Handle strikethrough: ~text~ => <del>text</del>
    text = text?.replace(/~(.*?)~/g, "<del>$1</del>");
    {
      // lists are handled using pre tag
      // Handle unordered lists (- or * at the beginning of a line)
      // text = text.replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>");
      // text = text.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");
      // // Handle ordered lists (1. 2. 3. at the beginning of a line)
      // text = text.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
      // text = text.replace(/(<li>.*<\/li>)/g, "<ol>$1</ol>");
    }
    // Handle mentions (@username)

    // text = text?.replace(/@([A-Za-z0-9_]+)/g, (match, userName) => {
    //   if (localStorage.getItem(userName)) {
    //     const name = JSON.parse(localStorage.getItem(userName) || "")?.data
    //       ?.user.real_name;
    //     return name;
    //   }
    // });

    // Handle emoji (e.g., :smile:)
    text = text?.replace(
      /:([a-zA-Z0-9_]+):/g,
      '<img src="https://emoji.slack-edge.com/T00000000/$1.png" alt=":$1:" class="emoji" />',
    );

    // Handle links (e.g., <https://example.com|Click Here>)
    text = text?.replace(/<([^|]+)\|([^>]+)>/g, '<a href="$1">$2</a>');

    // console.log(text);

    return text;
  };

  // Process the text and render it as HTML
  const processedText = formatSlackText(text);

  return (
    <div>
      {/* Use dangerouslySetInnerHTML to inject the processed HTML */}
      <div dangerouslySetInnerHTML={{ __html: processedText }} />
    </div>
  );
}

export default Renderer;
