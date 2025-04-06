"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getUserThread = async (threadId: string) => {
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

export const handleUserRedirect = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  const threads = await db.thread.findMany({
    where: {
      userId: session.user.id,
    },
  });
  const emptyThread = threads.find((thread) => !thread.messages);
  if (emptyThread) {
    return redirect(`/${emptyThread.id}`);
  }

  const thread = await db.thread.create({
    data: {
      userId: session.user.id,
      title: "New Chat",
    },
  });

  return redirect(`/${thread.id}`);
};

export const getUserThreads = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const threads = await db.thread.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return { success: "Threads fetched successfully", data: threads };
};

export const deleteThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  await db.thread.delete({
    where: {
      id: threadId,
      userId: session.user.id,
    },
  });
  revalidatePath("/");

  return { success: "Thread deleted successfully" };
};

export const editThread = async (threadId: string, title: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const existingThread = await db.thread.findUnique({
    where: {
      id: threadId,
      userId: session.user.id,
    },
  });
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db.thread.update({
    where: {
      id: threadId,
      userId: session.user.id,
    },
    data: {
      title,
      updatedAt: existingThread.updatedAt,
    },
  });
  revalidatePath("/");

  return { success: "Thread updated successfully" };
};

export const pinThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const existingThread = await db.thread.findUnique({
    where: {
      id: threadId,
      userId: session.user.id,
    },
  });
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db.thread.update({
    where: {
      id: threadId,
      userId: session.user.id,
    },
    data: {
      pinned: true,
      updatedAt: existingThread.updatedAt,
    },
  });
  revalidatePath("/");

  return { success: "Thread pinned successfully" };
};

export const unpinThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const existingThread = await db.thread.findUnique({
    where: {
      id: threadId,
      userId: session.user.id,
    },
  });
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db.thread.update({
    where: {
      id: threadId,
      userId: session.user.id,
    },
    data: {
      pinned: false,
      updatedAt: existingThread.updatedAt,
    },
  });
  revalidatePath("/");

  return { success: "Thread unpinned successfully" };
};

export const updateSharedThreadVisibility = async (
  threadId: string,
  requireAuth: boolean
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const existingThread = await db.thread.findUnique({
    where: {
      id: threadId,
      userId: session.user.id,
    },
  });
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db.thread.update({
    where: {
      id: threadId,
      userId: session.user.id,
    },
    data: {
      requireAuth,
      updatedAt: existingThread.updatedAt,
    },
  });
  revalidatePath("/");

  return { success: "Thread visibility updated successfully" };
};

export const getThreadFromShareId = async (shareId: string) => {
  const thread = await db.thread.findUnique({
    where: {
      shareId,
    },
  });
  return thread;
};

export const cloneSharedThread = async (threadId: string) => {
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
  if (!thread) {
    return { error: "Thread not found" };
  }
  if (thread.userId === session.user.id) {
    return { error: "You cannot clone your own thread" };
  }

  const newThread = await db.thread.create({
    data: {
      userId: session.user.id,
      title: thread.title,
      messages: thread.messages,
    },
  });

  return { success: "Thread cloned successfully", threadId: newThread.id };
};
