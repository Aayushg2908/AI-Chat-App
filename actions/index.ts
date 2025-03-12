"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const getThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const thread = await db.thread.findUnique({
    where: {
      id: threadId,
    },
  });

  return { success: "Thread fetched successfully", data: thread };
};

export const createThread = async (threadId?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const thread = await db.thread.create({
    data: {
      userId: session.user.id,
      title: "New Chat",
    },
  });

  revalidatePath("/");

  return { success: "Thread created successfully", threadId: thread.id };
};

export const saveThreadMessages = async (
  threadId: string,
  messages: string
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  await db.thread.update({
    where: {
      id: threadId,
    },
    data: {
      messages,
    },
  });

  return { success: "Messages saved successfully" };
};
