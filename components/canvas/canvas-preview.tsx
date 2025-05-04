"use client";

import { LiveProvider, LivePreview, LiveError } from "react-live";
import { useCanvas } from "@/hooks/use-canvas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog";
import * as lucide from "lucide-react";

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
        Button,
        Input,
        Label,
        Checkbox,
        z,
        Form,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogClose,
        DialogDescription,
        DialogFooter,
        DialogOverlay,
        DialogPortal,
        DialogTrigger,
        ...lucide,
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
