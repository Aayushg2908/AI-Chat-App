"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Components } from "react-markdown";
import { Check, Copy } from "lucide-react";

interface MessageContentProps {
  content: string;
  isUserMessage?: boolean;
}

export const MessageContent = ({
  content,
  isUserMessage = false,
}: MessageContentProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const codeBlocksRef = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
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

    const highlightStylesheet = document.getElementById("highlight-stylesheet");
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
        code .hljs-variable, 
        code .hljs-attr, 
        code .hljs-property { color: #f56565 !important; }
        code .hljs-keyword { color: #805ad5 !important; }
        code .hljs-function { color: #4299e1 !important; }
        code .hljs-string { color: #48bb78 !important; }
        code .hljs-number { color: #ed8936 !important; }
        code .hljs-comment { color: #718096 !important; font-style: italic; }
        
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
        
        /* Code block copy button */
        .code-block-wrapper {
          position: relative;
          width: 100%;
        }
        .code-copy-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(0, 0, 0, 0.3);
          color: #cbd5e0;
          border: none;
          border-radius: 4px;
          padding: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .code-copy-button:hover {
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
        }
        
        /* Fix for code overflow */
        pre, code {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
        }
        
        /* Ensure inline code doesn't overflow */
        p code {
          word-break: break-all !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      codeBlocksRef.current.clear();
    };
  }, [content]);

  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copiedIndex]);

  const getTextFromElement = useCallback((element: HTMLElement): string => {
    if (!element) return "";

    const codeElement = element.querySelector("code");
    if (codeElement) {
      return codeElement.textContent || "";
    }

    return element.textContent || "";
  }, []);

  const copyToClipboard = useCallback(
    (index: number) => {
      const preElement = codeBlocksRef.current.get(index);
      if (!preElement) {
        return;
      }

      const textToCopy = getTextFromElement(preElement);

      if (!textToCopy) {
        console.error("No text to copy");
        return;
      }

      try {
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
      } catch (err) {
        console.error("Error copying text:", err);

        try {
          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              setCopiedIndex(index);
            })
            .catch((err) => {
              console.error("Clipboard API copy failed:", err);
            });
        } catch (clipboardErr) {
          console.error("Both copy methods failed:", clipboardErr);
        }
      }
    },
    [getTextFromElement]
  );

  let codeBlockIndex = 0;

  const components: Components = {
    pre: ({ node, className, children, ...props }) => {
      const currentIndex = codeBlockIndex++;
      const preRef = useRef<HTMLPreElement>(null);

      useEffect(() => {
        if (preRef.current) {
          codeBlocksRef.current.set(currentIndex, preRef.current);
        }

        return () => {
          codeBlocksRef.current.delete(currentIndex);
        };
      }, [currentIndex]);

      const isCopied = copiedIndex === currentIndex;

      return (
        <div className="code-block-wrapper">
          <pre
            ref={preRef}
            className={`bg-gray-900 p-4 rounded-md overflow-x-auto my-2 border border-gray-700 ${
              className || ""
            }`}
            {...props}
          >
            {children}
          </pre>
          <button
            className="code-copy-button"
            onClick={() => copyToClipboard(currentIndex)}
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
      );
    },
    code: ({ node, className, children, ...props }) => {
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
    p: ({ node, children, ...props }) => (
      <p className="my-2" {...props}>
        {children}
      </p>
    ),
    a: ({ node, children, ...props }) => (
      <a
        className="text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ node, children, ...props }) => (
      <ul className="list-disc pl-5 my-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ node, children, ...props }) => (
      <ol className="list-decimal pl-5 my-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ node, children, ...props }) => (
      <li className="my-1" {...props}>
        {children}
      </li>
    ),
    h1: ({ node, children, ...props }) => (
      <h1 className="text-xl font-bold my-3" {...props}>
        {children}
      </h1>
    ),
    h2: ({ node, children, ...props }) => (
      <h2 className="text-lg font-bold my-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }) => (
      <h3 className="text-md font-bold my-2" {...props}>
        {children}
      </h3>
    ),
    blockquote: ({ node, children, ...props }) => (
      <blockquote
        className="border-l-4 border-gray-500 pl-4 py-1 my-2 text-gray-400"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ node, children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ node, children, ...props }) => (
      <thead className="bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ node, children, ...props }) => (
      <tbody className="divide-y divide-gray-700" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ node, children, ...props }) => (
      <tr className="hover:bg-gray-750" {...props}>
        {children}
      </tr>
    ),
    th: ({ node, children, ...props }) => (
      <th
        className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }) => (
      <td className="px-3 py-2 whitespace-nowrap" {...props}>
        {children}
      </td>
    ),
  };

  return (
    <div
      className={`text-base markdown-body ${
        isUserMessage ? "user-message" : ""
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[
          rehypeKatex,
          [rehypeHighlight, { ignoreMissing: true, detect: true }],
          rehypeRaw,
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
