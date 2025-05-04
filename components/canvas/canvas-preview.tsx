"use client";

import { LiveProvider, LivePreview, LiveError } from "react-live";
import { useCanvas } from "@/hooks/use-canvas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as lucide from "lucide-react";
import * as UI from "../ui";

const CanvasPreview = () => {
  const { code } = useCanvas();

  const handleTransformCode = (code: string) => {
    code = code.replace(/import.*?from.*?;\n/g, "");
    code = code.replace("\n", "\nrender(<Canvas />);\n");
    return code;
  };

  return (
    <LiveProvider
      code={code}
      scope={{
        React,
        useState,
        useEffect,
        useForm,
        zodResolver,
        z,
        ...lucide,
        ...UI,
      }}
      noInline
      transformCode={handleTransformCode}
    >
      <LiveError className="text-red-500 bg-black rounded p-2 mb-2" />
      <LivePreview />
    </LiveProvider>
  );
};

export default CanvasPreview;
