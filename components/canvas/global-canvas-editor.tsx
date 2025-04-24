"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Card, CardContent } from "../ui/card";
import { useCanvas } from "@/hooks/use-canvas";

const CanvasEditor = () => {
  const { code, readOnly } = useCanvas();

  return (
    <Card className="h-full border-0 rounded-none">
      <CardContent className="p-0 h-full">
        <CodeMirror
          value={code}
          height="100vh"
          theme={vscodeDark}
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
