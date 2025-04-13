"use server";

import { db } from "@/db/drizzle";
import { threads } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, desc, eq } from "drizzle-orm";
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

  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.id, threadId));

  return { success: "Thread fetched successfully", data: thread };
};

export const createThread = async (threadId?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [thread] = await db
    .insert(threads)
    .values({
      userId: session.user.id,
      title: "New Chat",
    })
    .returning();

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

  await db.update(threads).set({ messages }).where(eq(threads.id, threadId));

  return { success: "Messages saved successfully" };
};

export const handleUserRedirect = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return;

  const allThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.userId, session.user.id));
  const emptyThread = allThreads.find((thread) => !thread.messages);
  if (emptyThread) {
    return redirect(`/${emptyThread.id}`);
  }

  const [thread] = await db
    .insert(threads)
    .values({
      userId: session.user.id,
      title: "New Chat",
    })
    .returning();

  return redirect(`/${thread.id}`);
};

export const getUserThreads = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const allThreads = await db
    .select()
    .from(threads)
    .where(eq(threads.userId, session.user.id))
    .orderBy(desc(threads.updatedAt));

  return { success: "Threads fetched successfully", data: allThreads };
};

export const deleteThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  await db
    .delete(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
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

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db
    .update(threads)
    .set({ title, updatedAt: existingThread.updatedAt })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
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

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db
    .update(threads)
    .set({ pinned: true, updatedAt: existingThread.updatedAt })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
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

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db
    .update(threads)
    .set({ pinned: false, updatedAt: existingThread.updatedAt })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  revalidatePath("/");

  return { success: "Thread pinned successfully" };
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

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    return { error: "Thread not found" };
  }

  await db
    .update(threads)
    .set({ requireAuth, updatedAt: existingThread.updatedAt })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  revalidatePath("/");

  return { success: "Thread visibility updated successfully" };
};

export const getThreadFromShareId = async (shareId: string) => {
  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.shareId, shareId));
  return thread;
};

export const cloneSharedThread = async (threadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.id, threadId));
  if (!thread) {
    return { error: "Thread not found" };
  }
  if (thread.userId === session.user.id) {
    return { error: "You cannot clone your own thread" };
  }

  const [newThread] = await db
    .insert(threads)
    .values({
      userId: session.user.id,
      title: thread.title,
      messages: thread.messages,
    })
    .returning();

  return { success: "Thread cloned successfully", threadId: newThread.id };
};

export const branchThread = async (title: string, messages: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const [newThread] = await db
    .insert(threads)
    .values({
      userId: session.user.id,
      title,
      messages,
    })
    .returning();
  revalidatePath("/");

  return { success: "Thread branched successfully", threadId: newThread.id };
};

export const regenerateShareLink = async (shareThreadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.id, shareThreadId));
  if (!thread) {
    return { error: "Thread not found" };
  }

  await db
    .update(threads)
    .set({
      shareId: crypto.randomUUID(),
      updatedAt: thread.updatedAt,
    })
    .where(
      and(eq(threads.id, shareThreadId), eq(threads.userId, session.user.id))
    );
  revalidatePath("/");

  return { success: "Share link regenerated successfully" };
};
