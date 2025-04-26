"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  ComponentProps,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { Check, Copy } from "lucide-react";
import { GlobeIcon } from "lucide-react";
import { Card } from "../ui/card";
import { useCanvas } from "@/hooks/use-canvas";

interface MessageContentProps {
  content: string;
  isUserMessage?: boolean;
  sources?: Array<{
    title?: string;
    url: string;
    snippet?: string;
  }>;
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  className?: string;
  children: React.ReactNode;
  index: number;
  isCopied: boolean;
  copyToClipboard: (index: number) => void;
}

const arePropsEqual = (
  prevProps: MessageContentProps,
  nextProps: MessageContentProps
) => {
  if (prevProps.content && nextProps.content) {
    const prevLength = prevProps.content.length;
    const nextLength = nextProps.content.length;

    if (Math.abs(nextLength - prevLength) < 10 && nextLength > 50) {
      return true;
    }
  }

  return (
    prevProps.content === nextProps.content &&
    prevProps.isUserMessage === nextProps.isUserMessage &&
    JSON.stringify(prevProps.sources) === JSON.stringify(nextProps.sources)
  );
};

export const MessageContent = React.memo(
  ({ content, isUserMessage = false, sources }: MessageContentProps) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedSourceIndex, setCopiedSourceIndex] = useState<number | null>(
      null
    );
    const [expandedSourceIndex, setExpandedSourceIndex] = useState<
      number | null
    >(null);
    const codeBlocksRef = useRef<Map<number, HTMLElement>>(new Map());
    const [canvasCode, setCanvasCode] = useState<string | null>(null);
    const { onOpen } = useCanvas();

    useEffect(() => {
      const loadStylesheets = () => {
        const katexStylesheet = document.getElementById("katex-stylesheet");
        if (!katexStylesheet) {
          const link = document.createElement("link");
          link.id = "katex-stylesheet";
          link.rel = "stylesheet";
          link.href =
            "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
          link.integrity =
            "sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV";
          link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }

        const highlightStylesheet = document.getElementById(
          "highlight-stylesheet"
        );
        if (!highlightStylesheet) {
          const link = document.createElement("link");
          link.id = "highlight-stylesheet";
          link.rel = "stylesheet";
          link.href =
            "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
          document.head.appendChild(link);
        }

        const customStyles = document.getElementById("custom-markdown-styles");
        if (!customStyles) {
          const style = document.createElement("style");
          style.id = "custom-markdown-styles";
          style.textContent = `
          .math-inline .katex { color: #f56565 !important; }
          .math-display .katex { color: #ed8936 !important; }
          
          /* Base code styling */
          .code-block {
            background-color: #1e2127 !important;
            border-radius: 6px !important;
            margin: 0 !important;
            position: relative;
            overflow: hidden;
          }
          
          .code-header {
            background-color: #191b20;
            color: #abb2bf;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.85rem;
            padding: 0.6rem 1rem;
            border-bottom: 1px solid #13151a;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .code-content {
            overflow-x: auto;
          }
          
          /* Custom scrollbar for code blocks */
          .code-content::-webkit-scrollbar {
            height: 6px;
            width: 6px;
          }
          
          .code-content::-webkit-scrollbar-track {
            background: #1e2127;
          }
          
          .code-content::-webkit-scrollbar-thumb {
            background: #3a3f4b;
            border-radius: 3px;
          }
          
          .code-content::-webkit-scrollbar-thumb:hover {
            background: #4b5263;
          }
          
          .code-main {
            padding: 1rem;
            overflow-x: auto;
            width: 100%;
            background-color: #1e2127;
          }
          
          .code-main pre {
            margin: 0 !important;
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          
          .code-main code {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.9rem;
            line-height: 1.5;
            background-color: transparent !important;
            padding: 0 !important;
            white-space: pre !important;
            color: #f8f8f2 !important;
          }
          
          /* Code copy button */
          .code-copy-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: rgba(255, 255, 255, 0.08);
            color: #abb2bf;
            border: none;
            border-radius: 4px;
            padding: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 10;
          }
          
          .code-copy-button:hover {
            background-color: rgba(255, 255, 255, 0.15);
            color: white;
          }
          
          /* Dracula theme syntax highlighting - simplified and focused on the elements in the image */
          code .hljs-keyword,
          code span.keyword,
          code .keyword {
            color: #ff79c6 !important;
          }
          
          code .hljs-built_in,
          code span.built_in,
          code .built_in {
            color: #8be9fd !important;
          }
          
          code .hljs-type,
          code span.type,
          code .type {
            color: #8be9fd !important;
          }
          
          code .hljs-literal,
          code span.literal,
          code .literal,
          code span.null {
            color: #bd93f9 !important;
          }
          
          code .hljs-number,
          code span.number,
          code .number {
            color: #bd93f9 !important;
          }
          
          code .hljs-string,
          code span.string,
          code .string {
            color: #50fa7b !important;
          }
          
          code .hljs-comment,
          code span.comment,
          code .comment {
            color: #6272a4 !important;
          }
          
          code .hljs-operator,
          code span.operator,
          code .operator {
            color: #ff79c6 !important;
          }
          
          code .hljs-punctuation,
          code span.punctuation,
          code .punctuation {
            color: #f8f8f2 !important;
          }
          
          code .hljs-variable,
          code span.variable,
          code .variable {
            color: #f8f8f2 !important;
          }
          
          code .hljs-function,
          code span.function,
          code .function {
            color: #50fa7b !important;
          }
          
          /* Specific TypeScript/React elements as seen in the image */
          code span.const,
          code .const {
            color: #ff79c6 !important;
          }
          
          code span.hook,
          code .hook,
          code span[class*="useState"],
          code span[class*="useEffect"],
          code span[class*="useRef"] {
            color: #50fa7b !important;
          }
          
          code span.component,
          code .component {
            color: #8be9fd !important;
          }
          
          /* Direct element styling to override any library defaults */
          .code-block code .token.keyword,
          .code-block code .token.class-name,
          .code-block code .token.selector,
          .code-block code .token.tag,
          .code-block code .token.operator {
            color: #ff79c6 !important;
          }
          
          .code-block code .token.function,
          .code-block code .token.function-name,
          .code-block code .token.attr-name,
          .code-block code .token.method {
            color: #50fa7b !important;
          }
          
          .code-block code .token.string,
          .code-block code .token.attr-value,
          .code-block code .token.url {
            color: #50fa7b !important;
          }
          
          .code-block code .token.number,
          .code-block code .token.boolean,
          .code-block code .token.constant {
            color: #bd93f9 !important;
          }
          
          .code-block code .token.comment {
            color: #6272a4 !important;
          }
          
          .code-block code .token.punctuation {
            color: #f8f8f2 !important;
          }
          
          /* Specific overrides for elements in the image */
          .code-block code .token.keyword + .token.function,
          .code-block code .token.keyword + .token.class-name {
            color: #8be9fd !important;
          }
          
          /* Force specific colors for common elements */
          .code-block code .token.parameter {
            color: #ffb86c !important;
          }
          
          .code-block code .token.property {
            color: #50fa7b !important;
          }
          
          /* Ensure React hooks are properly colored */
          .code-block code span[class*="useState"],
          .code-block code span[class*="useEffect"],
          .code-block code span[class*="useRef"] {
            color: #50fa7b !important;
          }
          
          /* Adjust styles for user messages */
          .user-message .markdown-body a { color: #90cdf4 !important; }
          .user-message .markdown-body code:not([class*="language-"]) { 
            background-color: rgba(0, 0, 0, 0.2) !important; 
            color: #fbd38d !important;
          }
          .user-message .markdown-body pre {
            background-color: rgba(0, 0, 0, 0.3) !important;
            border-color: rgba(0, 0, 0, 0.2) !important;
          }
          
          /* Fix for code overflow */
          pre, code {
            max-width: 100% !important;
          }
          
          /* Ensure inline code doesn't overflow */
          p code {
            word-break: break-all !important;
            background-color: #2c313a !important;
            color: #e06c75 !important;
            padding: 0.2em 0.4em !important;
            border-radius: 3px !important;
            font-size: 0.85em !important;
          }
        `;
          document.head.appendChild(style);
        }
      };

      loadStylesheets();

      return () => {
        codeBlocksRef.current.clear();
      };
    }, []);

    useEffect(() => {
      const canvasMatch = content.match(
        /\*\*Canvas: (.*?)\*\*([\s\S]*?)```canvas\n([\s\S]*?)```/
      );
      if (canvasMatch) {
        const [, , , code] = canvasMatch;
        setCanvasCode(code);
      } else {
        setCanvasCode(null);
      }
    }, [content]);

    useEffect(() => {
      if (copiedIndex !== null) {
        const timeout = setTimeout(() => {
          setCopiedIndex(null);
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }, [copiedIndex]);

    const getTextFromElement = useCallback((element: HTMLElement): string => {
      if (!element) return "";
      const codeElement = element.querySelector("code");
      return codeElement
        ? codeElement.textContent || ""
        : element.textContent || "";
    }, []);

    const copyToClipboard = useCallback(
      (index: number) => {
        const preElement = codeBlocksRef.current.get(index);
        if (!preElement) return;

        const textToCopy = getTextFromElement(preElement);
        if (!textToCopy) {
          console.error("No text to copy");
          return;
        }

        try {
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => setCopiedIndex(index))
            .catch((err) => {
              console.error("Clipboard API copy failed:", err);
              const textarea = document.createElement("textarea");
              textarea.value = textToCopy;
              textarea.style.position = "absolute";
              textarea.style.left = "-9999px";
              document.body.appendChild(textarea);
              textarea.select();
              textarea.setSelectionRange(0, 99999);
              const successful = document.execCommand("copy");
              document.body.removeChild(textarea);

              if (successful) {
                setCopiedIndex(index);
              } else {
                console.error("execCommand copy failed");
              }
            });
        } catch (err) {
          console.error("Error copying text:", err);
        }
      },
      [getTextFromElement]
    );

    const components: Components = useMemo(() => {
      let codeBlockIndex = 0;

      return {
        pre: ({
          className,
          children,
          ...props
        }: React.HTMLAttributes<HTMLPreElement>) => {
          const currentIndex = codeBlockIndex++;
          return (
            <CodeBlock
              className={className}
              index={currentIndex}
              copyToClipboard={copyToClipboard}
              isCopied={copiedIndex === currentIndex}
              {...props}
            >
              {children}
            </CodeBlock>
          );
        },
        code({
          className,
          children,
          ...props
        }: React.HTMLAttributes<HTMLElement>) {
          const language = className?.replace("language-", "");
          if (language === "canvas") {
            return null;
          }
          const isInline = !className;
          if (isInline) {
            return (
              <code
                className="bg-gray-800 px-1 py-0.5 rounded text-pink-400"
                {...props}
              >
                {children}
              </code>
            );
          }
          return (
            <code className={`${className || ""} hljs`} {...props}>
              {children}
            </code>
          );
        },
        p: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLParagraphElement>) => (
          <p className="my-2" {...props}>
            {children}
          </p>
        ),
        a: ({
          children,
          ...props
        }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
          <a
            className="text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {children}
          </a>
        ),
        ul: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLUListElement>) => (
          <ul className="list-disc pl-5 my-2" {...props}>
            {children}
          </ul>
        ),
        ol: ({
          children,
          ...props
        }: React.OlHTMLAttributes<HTMLOListElement>) => (
          <ol className="list-decimal pl-5 my-2" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
          <li className="my-1" {...props}>
            {children}
          </li>
        ),
        h1: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h1 className="text-xl font-bold my-3" {...props}>
            {children}
          </h1>
        ),
        h2: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h2 className="text-lg font-bold my-3" {...props}>
            {children}
          </h2>
        ),
        h3: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h3 className="text-md font-bold my-2" {...props}>
            {children}
          </h3>
        ),
        blockquote: ({
          children,
          ...props
        }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
          <blockquote
            className="border-l-4 border-gray-500 pl-4 py-1 my-2 text-gray-400"
            {...props}
          >
            {children}
          </blockquote>
        ),
        table: ({
          children,
          ...props
        }: React.TableHTMLAttributes<HTMLTableElement>) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-700" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLTableSectionElement>) => (
          <thead className="bg-gray-800" {...props}>
            {children}
          </thead>
        ),
        tbody: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLTableSectionElement>) => (
          <tbody className="divide-y divide-gray-700" {...props}>
            {children}
          </tbody>
        ),
        tr: ({
          children,
          ...props
        }: React.HTMLAttributes<HTMLTableRowElement>) => (
          <tr className="hover:bg-gray-750" {...props}>
            {children}
          </tr>
        ),
        th: ({
          children,
          ...props
        }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
          <th
            className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            {...props}
          >
            {children}
          </th>
        ),
        td: ({
          children,
          ...props
        }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
          <td className="px-3 py-2 whitespace-nowrap" {...props}>
            {children}
          </td>
        ),
      };
    }, [copiedIndex, copyToClipboard]);

    const CodeBlock = React.memo(
      ({
        className,
        children,
        index,
        isCopied,
        copyToClipboard,
        ...props
      }: CodeBlockProps) => {
        const preRef = useRef<HTMLPreElement>(null);

        let lang = "";
        const matchClassName = /language-(\w+)/.exec(className || "");
        if (matchClassName && matchClassName[1]) {
          lang = matchClassName[1];
        }
        if (!lang && children) {
          try {
            const childElement = React.Children.toArray(children)[0];
            if (React.isValidElement(childElement)) {
              const childProps =
                childElement.props as ComponentProps<React.ElementType>;
              if (childProps && childProps.className) {
                const childMatch = /language-(\w+)/.exec(childProps.className);
                if (childMatch && childMatch[1]) {
                  lang = childMatch[1];
                }
              }
            }
          } catch (error) {
            console.error("Error extracting language from code block:", error);
          }
        }

        const getLanguageDisplayName = (langId: string): string => {
          const normalizedLangId = langId.toLowerCase();
          const languageMap: Record<string, string> = {
            js: "JavaScript",
            javascript: "JavaScript",
            ts: "TypeScript",
            typescript: "TypeScript",
            jsx: "JSX",
            tsx: "TSX",
            html: "HTML",
            css: "CSS",
            scss: "SCSS",
            sass: "Sass",
            less: "Less",
            python: "Python",
            py: "Python",
            ruby: "Ruby",
            rb: "Ruby",
            go: "Go",
            rust: "Rust",
            java: "Java",
            c: "C",
            cpp: "C++",
            cs: "C#",
            csharp: "C#",
            php: "PHP",
            swift: "Swift",
            kotlin: "Kotlin",
            scala: "Scala",
            shell: "Shell",
            bash: "Bash",
            sh: "Shell",
            zsh: "Shell",
            powershell: "PowerShell",
            ps: "PowerShell",
            sql: "SQL",
            json: "JSON",
            yaml: "YAML",
            yml: "YAML",
            xml: "XML",
            markdown: "Markdown",
            md: "Markdown",
            plaintext: "Plain Text",
            text: "Plain Text",
          };
          return (
            languageMap[normalizedLangId] ||
            langId.charAt(0).toUpperCase() + langId.slice(1)
          );
        };

        const displayLanguage = lang ? getLanguageDisplayName(lang) : "Code";

        useLayoutEffect(() => {
          if (preRef.current) {
            codeBlocksRef.current.set(index, preRef.current);
          }
          return () => {
            codeBlocksRef.current.delete(index);
          };
        }, [index]);

        return (
          <div className="code-block-wrapper">
            <div className="code-block">
              <div className="code-header">
                <span>{displayLanguage}</span>
              </div>
              <div className="code-content">
                <div className="code-main">
                  <pre ref={preRef} {...props}>
                    {children}
                  </pre>
                </div>
              </div>
              <button
                className="code-copy-button"
                onClick={() => copyToClipboard(index)}
                aria-label="Copy code"
                title="Copy code"
                type="button"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        );
      }
    );

    CodeBlock.displayName = "CodeBlock";

    const wrapperClassName = `prose dark:prose-invert prose-sm max-w-none break-words ${
      isUserMessage ? "user-message" : ""
    }`;

    const messageContent = (
      <div className={wrapperClassName}>
        {sources && sources.length > 0 && !isUserMessage && (
          <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
              <GlobeIcon className="size-4 mr-2 text-blue-500" />
              Web sources ({sources.length})
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sources.map((source, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {source.title || source.url}
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(source.url);
                        setCopiedSourceIndex(index);
                        setTimeout(() => setCopiedSourceIndex(null), 2000);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ml-2"
                    >
                      {copiedSourceIndex === index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {source.snippet && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          setExpandedSourceIndex(
                            expandedSourceIndex === index ? null : index
                          )
                        }
                        className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {expandedSourceIndex === index
                          ? "Show less"
                          : "Show snippet"}
                      </button>
                      {expandedSourceIndex === index && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                          {source.snippet}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[
            rehypeKatex,
            [rehypeHighlight, { ignoreMissing: true, detect: true }],
            rehypeRaw,
          ]}
          components={components}
        >
          {content.replace(/```canvas\n[\s\S]*?```/, "")}
        </ReactMarkdown>
        {canvasCode && (
          <Card
            className="mt-4 cursor-pointer"
            onClick={() => onOpen(canvasCode, false)}
          >
            <div className="bg-muted/50 px-4 py-2 border-b">
              <h3 className="font-semibold">
                {content.match(/\*\*Canvas: (.*?)\*\*/)?.[1] || "Canvas"}
              </h3>
              <span className="text-sm text-muted-foreground">
                Click to view the Canvas Editor
              </span>
            </div>
          </Card>
        )}
      </div>
    );

    return messageContent;
  },
  arePropsEqual
);

MessageContent.displayName = "MessageContent";

export default MessageContent;
