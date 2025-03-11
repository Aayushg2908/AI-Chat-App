"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useEffect } from "react";
import type { Components } from "react-markdown";

interface MessageContentProps {
  content: string;
  isUserMessage?: boolean;
}

export const MessageContent = ({ content, isUserMessage = false }: MessageContentProps) => {
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
      `;
      document.head.appendChild(style);
    }
  }, []);

  const components: Components = {
    pre: ({ node, className, children, ...props }) => (
      <pre
        className={`bg-gray-900 p-4 rounded-md overflow-x-auto my-2 border border-gray-700 ${
          className || ""
        }`}
        {...props}
      >
        {children}
      </pre>
    ),
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
    <div className={`text-base markdown-body ${isUserMessage ? 'user-message' : ''}`}>
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
