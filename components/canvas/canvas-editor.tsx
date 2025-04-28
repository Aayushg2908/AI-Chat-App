"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";
import { useCanvas } from "@/hooks/use-canvas";

const CanvasEditor = () => {
  const { code, readOnly, onClose } = useCanvas();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Card className="h-full border-0 rounded-none relative">
      <div className="absolute right-2 top-1 z-50 flex items-center gap-1 rounded-md p-1">
        <Button
          variant="ghost"
          className="bg-gray-700 hover:bg-gray-600"
          size="sm"
          onClick={handleCopy}
        >
          <Copy className="size-2" />
        </Button>
        <Button
          variant="ghost"
          className="bg-gray-700 hover:bg-gray-600"
          size="sm"
          onClick={onClose}
        >
          <X className="size-2" />
        </Button>
      </div>
      <CardContent className="p-0 h-full">
        <CodeMirror
          value={code}
          theme={vscodeDark}
          height="100vh"
          extensions={[javascript({ jsx: true, typescript: true })]}
          readOnly={readOnly}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            history: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CanvasEditor;
