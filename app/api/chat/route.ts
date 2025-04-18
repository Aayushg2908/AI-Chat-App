import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { groq } from "@ai-sdk/groq";
import { LanguageModelV1, streamText } from "ai";

export interface Message {
  role: string;
  content: string;
}

export const maxDuration = 30;

const getModels = (useSearch: boolean = false, effortLevel?: string) => ({
  "gemini-2.0-flash-001": google("gemini-2.0-flash-001", {
    useSearchGrounding: useSearch,
  }),
  "gemini-2.0-pro-exp-02-05": google("gemini-2.0-pro-exp-02-05", {
    useSearchGrounding: useSearch,
  }),
  "gemini-2.0-flash-lite-preview-02-05": google(
    "gemini-2.0-flash-lite-preview-02-05"
  ),
  "gemini-2.0-flash-thinking-exp-01-21": google(
    "gemini-2.0-flash-thinking-exp-01-21",
    {
      useSearchGrounding: useSearch,
    }
  ),
  "gemini-2.5-pro-exp-03-25": google("gemini-2.5-pro-exp-03-25"),
  "gpt-4o-mini": useSearch
    ? openai.responses("gpt-4o-mini")
    : openai("gpt-4o-mini"),
  "gpt-4o": useSearch ? openai.responses("gpt-4o") : openai("gpt-4o"),
  "gpt-4.1-nano-2025-04-14": openai("gpt-4.1-nano-2025-04-14"),
  "gpt-4.1-mini-2025-04-14": openai("gpt-4.1-mini-2025-04-14"),
  "gpt-4.1-2025-04-14": openai("gpt-4.1-2025-04-14"),
  "o3-mini-2025-01-31": openai("o3-mini-2025-01-31", {
    reasoningEffort: effortLevel as "low" | "medium" | "high",
  }),
  "deepseek-r1-distill-llama-70b": groq("deepseek-r1-distill-llama-70b"),
  "deepseek-r1-distill-qwen-32b": groq("deepseek-r1-distill-qwen-32b"),
  "qwen-2.5-32b": groq("qwen-2.5-32b"),
  "qwen-qwq-32b": groq("qwen-qwq-32b"),
  "meta-llama/llama-4-scout-17b-16e-instruct": groq(
    "meta-llama/llama-4-scout-17b-16e-instruct"
  ),
});

type ModelKey = keyof ReturnType<typeof getModels>;

export async function POST(req: Request) {
  const { messages, model, search, effortLevel, context, canvasMode } =
    await req.json();

  const MODELS = getModels(search === true, effortLevel);

  const isValidModel = (key: string): key is ModelKey =>
    typeof key === "string" && Object.keys(MODELS).includes(key);

  const modelToUse = isValidModel(model)
    ? MODELS[model]
    : MODELS["gemini-2.0-flash-lite-preview-02-05"];

  const systemMessage: Message = {
    role: "system",
    content: `You are a helpful AI assistant that provides detailed and well-formatted responses.
    ${
      search
        ? "You have access to web search capabilities to provide up-to-date information."
        : ""
    }
    ${
      context
        ? `\n\nThe user has specifically selected the following content for you to focus on:\n${context}`
        : ""
    }
    ${
      canvasMode
        ? `\n\nThe user has enabled Canvas mode, which means they want to create a UI component using React and shadcn/ui components. Your task is to generate a complete, functional React component that implements a user interface based on their request.

        Follow these guidelines:
        1. Create a well-designed UI component that addresses the user's needs
        2. Use shadcn/ui components appropriately (Button, Card, Dialog, Form, etc.)
        3. Include proper state management with React hooks where needed
        4. Ensure the component is responsive and follows best practices
        5. Add comments to explain complex logic or design decisions

        Before the canvas code block, provide a brief description with this format:

        **Canvas: [Title of the UI Component]**
        This component implements [brief description of functionality and purpose]. It uses [list key shadcn/ui components used] to create a responsive and accessible interface.

        \`\`\`canvas
        // React component using shadcn/ui
        import React from 'react';
        import { useState, useEffect } from 'react';
        // Import shadcn/ui components
        import { Button } from '@/components/ui/button';
        import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
        // Add more imports as needed

        export default function Canvas() {
          // State management
          const [state, setState] = useState(initialValue);
          
          // Component logic
          
          return (
            <div className="p-4">
              {/* Implement the UI using shadcn/ui components */}
              <Card>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Content goes here */}
                </CardContent>
                <CardFooter>
                  <Button>Action</Button>
                </CardFooter>
              </Card>
            </div>
          );
        }
        \`\`\`

        Make sure the React code is complete, well-structured, and ready to be rendered in a React application. Focus on creating a polished, professional UI component that solves the user's specific needs.`
        : ""
    }

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

  const hasSystemMessage = messages.some(
    (msg: Message) => msg.role === "system"
  );
  const enhancedMessages = hasSystemMessage
    ? messages
    : [systemMessage, ...messages];

  const result = streamText({
    model: modelToUse as unknown as LanguageModelV1,
    messages: enhancedMessages,
    ...(search && model.startsWith("gpt")
      ? {
          tools: {
            web_search_preview: openai.tools.webSearchPreview(),
          },
        }
      : {}),
  });

  return result.toDataStreamResponse({
    sendSources: true,
  });
}
