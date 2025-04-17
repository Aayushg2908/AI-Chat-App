"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Card, CardContent } from "../ui/card";

interface CanvasEditorProps {
  code: string;
  readOnly?: boolean;
}

const CanvasEditor = ({ code, readOnly = false }: CanvasEditorProps) => {
  return (
    <Card className="h-full border-0 rounded-none">
      <CardContent className="p-0 h-full">
        <CodeMirror
          value={code}
          height="600px"
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
