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
