"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
  ComponentProps,
} from "react";
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
        
        /* Code highlighting colors */
        code .hljs-keyword { color: #c678dd !important; }  /* purple */
        code .hljs-built_in { color: #e6c07b !important; } /* yellow-ish */
        code .hljs-type { color: #e6c07b !important; }     /* yellow-ish */
        code .hljs-literal { color: #56b6c2 !important; }  /* cyan */
        code .hljs-number { color: #d19a66 !important; }   /* orange */
        code .hljs-regexp { color: #98c379 !important; }   /* green */
        code .hljs-string { color: #98c379 !important; }   /* green */
        code .hljs-subst { color: #e6c07b !important; }    /* yellow-ish */
        code .hljs-symbol { color: #56b6c2 !important; }   /* cyan */
        code .hljs-class { color: #e6c07b !important; }    /* yellow-ish */
        code .hljs-function { color: #61afef !important; } /* blue */
        code .hljs-title { color: #61afef !important; }    /* blue */
        code .hljs-params { color: #d19a66 !important; }   /* orange */
        code .hljs-comment { color: #7f848e !important; font-style: italic; } /* gray */
        code .hljs-doctag { color: #c678dd !important; }   /* purple */
        code .hljs-meta { color: #7f848e !important; }     /* gray */
        code .hljs-section { color: #e06c75 !important; }  /* red */
        code .hljs-tag { color: #e06c75 !important; }      /* red */
        code .hljs-name { color: #e06c75 !important; }     /* red */
        code .hljs-attr { color: #d19a66 !important; }     /* orange */
        code .hljs-attribute { color: #98c379 !important; }/* green */
        code .hljs-variable { color: #e06c75 !important; } /* red */
        code .hljs-template-variable { color: #e06c75 !important; } /* red */
        code .hljs-selector-tag { color: #c678dd !important; } /* purple */
        code .hljs-selector-id { color: #61afef !important; }  /* blue */
        code .hljs-selector-class { color: #d19a66 !important; } /* orange */
        code .hljs-selector-attr { color: #c678dd !important; } /* purple */
        code .hljs-selector-pseudo { color: #56b6c2 !important; } /* cyan */
        code .hljs-addition { color: #98c379 !important; background: rgba(152, 195, 121, 0.1); } /* green */
        code .hljs-deletion { color: #e06c75 !important; background: rgba(224, 108, 117, 0.1); } /* red */
        code .hljs-emphasis { font-style: italic; }
        code .hljs-strong { font-weight: bold; }
        
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
        
        /* Code block wrapper */
        .code-block-wrapper {
          position: relative;
          width: 100%;
          margin: 1rem 0;
        }
        
        .code-block {
          background-color: #282c34 !important;
          border-radius: 6px !important;
          margin: 0 !important;
          position: relative;
          overflow: hidden;
        }
        
        .code-header {
          background-color: #21252b;
          color: #abb2bf;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #181a1f;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .code-content {
          overflow-x: auto;
        }
        
        .code-main {
          padding: 1rem;
          overflow-x: auto;
          width: 100%;
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
          font-size: 0.85rem;
          line-height: 1.5;
          background-color: transparent !important;
          padding: 0 !important;
          white-space: pre !important;
        }
        
        /* Code copy button */
        .code-copy-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background-color: rgba(255, 255, 255, 0.1);
          color: #abb2bf;
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
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
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

    const currentRef = codeBlocksRef.current;
    return () => {
      currentRef.clear();
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

  // Create a proper React component for code blocks
  const CodeBlock = React.memo(
    ({
      className,
      children,
      index,
      ...props
    }: {
      className?: string;
      children: React.ReactNode;
      index: number;
    } & React.HTMLAttributes<HTMLPreElement>) => {
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

      let displayLanguage = "Code";

      if (lang) {
        displayLanguage = getLanguageDisplayName(lang);
      } else {
        const codeContent = String(children).toLowerCase();
        if (
          codeContent.includes("def ") ||
          codeContent.includes("import ") ||
          codeContent.includes("class ") ||
          codeContent.includes("print(") ||
          codeContent.includes("nums:") ||
          codeContent.includes("target:") ||
          /^\s*#.*/.test(codeContent) //
        ) {
          displayLanguage = "Python";
        }
      }

      useLayoutEffect(() => {
        if (preRef.current) {
          codeBlocksRef.current.set(index, preRef.current);
        }

        return () => {
          codeBlocksRef.current.delete(index);
        };
      }, [index]);

      const isCopied = copiedIndex === index;

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
      );
    }
  );

  // Add display name to the component
  CodeBlock.displayName = "CodeBlock";

  const components: Components = {
    pre: ({ className, children, ...props }) => {
      const currentIndex = codeBlockIndex++;
      return (
        <CodeBlock className={className} index={currentIndex} {...props}>
          {children}
        </CodeBlock>
      );
    },
    code: ({ className, children, ...props }) => {
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
    p: ({ children, ...props }) => (
      <p className="my-2" {...props}>
        {children}
      </p>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-5 my-2" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-5 my-2" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="my-1" {...props}>
        {children}
      </li>
    ),
    h1: ({ children, ...props }) => (
      <h1 className="text-xl font-bold my-3" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="text-lg font-bold my-3" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="text-md font-bold my-2" {...props}>
        {children}
      </h3>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-gray-500 pl-4 py-1 my-2 text-gray-400"
        {...props}
      >
        {children}
      </blockquote>
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full divide-y divide-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-700" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="hover:bg-gray-750" {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th
        className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
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
