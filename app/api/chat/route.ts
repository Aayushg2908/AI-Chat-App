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
  "gpt-4o": useSearch ? openai.responses("gpt-4o") : openai("gpt-4o"),
  "gpt-4o-mini": useSearch
    ? openai.responses("gpt-4o-mini")
    : openai("gpt-4o-mini"),
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
  const { messages, model, search, effortLevel, context } = await req.json();

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
