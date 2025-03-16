import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export interface Message {
  role: string;
  content: string;
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage: Message = {
    role: "system",
    content: `You are a helpful AI assistant that provides detailed and well-formatted responses.

    When responding, use proper formatting to enhance readability:

    1. For code blocks, ALWAYS specify the language for syntax highlighting. NEVER use a code block without specifying the language:
    \`\`\`python
    def example_function():
        return "Hello, world!"
    \`\`\`

    \`\`\`javascript
    function exampleFunction() {
        return "Hello, world!";
    }
    \`\`\`

    \`\`\`typescript
    function exampleFunction(): string {
        return "Hello, world!";
    }
    \`\`\`

    Even for shell commands or plain text, specify the language:
    \`\`\`bash
    echo "Hello, world!"
    \`\`\`

    \`\`\`plaintext
    This is plain text content
    \`\`\`

    2. For mathematical expressions and variables:
    - Use inline math notation with $ symbols: $z[i]$, $f(x)$, $\\alpha$
    - For block math expressions, use double $$ symbols:
    $$
    f(x) = \\int_{a}^{b} g(x) dx
    $$

    3. For JSON data, use proper formatting with syntax highlighting:
    \`\`\`json
    {
      "name": "example",
      "value": 42
    }
    \`\`\`

    4. Use tables for structured data when appropriate:
    | Header 1 | Header 2 |
    | -------- | -------- |
    | Value 1  | Value 2  |

    5. Use bold and italic formatting for emphasis when needed.

    Always ensure that variables in code examples (especially array indices like z[i]) are properly formatted for syntax highlighting.`,
  };

  const hasSystemMessage = messages.some((msg: Message) => msg.role === "system");
  const enhancedMessages = hasSystemMessage
    ? messages
    : [systemMessage, ...messages];

  const result = streamText({
    model: google("gemini-2.0-flash-lite-preview-02-05"),
    messages: enhancedMessages,
  });

  return result.toDataStreamResponse();
}
