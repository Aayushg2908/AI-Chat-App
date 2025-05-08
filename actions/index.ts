"use server";

import { db } from "@/db/drizzle";
import { threads, users } from "@/db/schema";
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

export const saveThreadMessages = async (
  threadId: string,
  messages: string
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [thread] = await db
    .update(threads)
    .set({ messages, updatedAt: new Date() })
    .where(eq(threads.id, threadId))
    .returning();

  return thread.updatedAt;
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
    throw new Error("Unauthorized");
  }

  await db
    .delete(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
};

export const editThread = async (threadId: string, title: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    throw new Error("Thread not found");
  }

  await db
    .update(threads)
    .set({ title })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
};

export const pinAndUnpinThread = async (threadId: string, pin: boolean) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    throw new Error("Thread not found");
  }

  await db
    .update(threads)
    .set({ pinned: pin })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
};

export const updateSharedThreadVisibility = async (
  threadId: string,
  requireAuth: boolean
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [existingThread] = await db
    .select()
    .from(threads)
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
  if (!existingThread) {
    throw new Error("Thread not found");
  }

  await db
    .update(threads)
    .set({ requireAuth })
    .where(and(eq(threads.id, threadId), eq(threads.userId, session.user.id)));
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
    throw new Error("Unauthorized");
  }

  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.id, threadId));
  if (!thread) {
    throw new Error("Thread not found");
  }
  if (thread.userId === session.user.id) {
    throw new Error("You cannot clone your own thread");
  }

  const [newThread] = await db
    .insert(threads)
    .values({
      userId: session.user.id,
      title: thread.title,
      messages: thread.messages,
    })
    .returning();

  return { threadId: newThread.id };
};

export const branchThread = async (title: string, messages: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
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

  return { threadId: newThread.id };
};

export const regenerateShareLink = async (shareThreadId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [thread] = await db
    .select()
    .from(threads)
    .where(eq(threads.id, shareThreadId));
  if (!thread) {
    throw new Error("Thread not found");
  }

  await db
    .update(threads)
    .set({
      shareId: crypto.randomUUID(),
    })
    .where(
      and(eq(threads.id, shareThreadId), eq(threads.userId, session.user.id))
    );
};

export const deleteAccount = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  await db.delete(users).where(eq(users.id, session.user.id));
};

export const getAiCustomizations = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id));
  if (!user) {
    throw new Error("User not found");
  }

  return {
    aiNickname: user.aiNickname,
    aiPersonality: user.aiPersonality,
  };
};

export const updateAiCustomizations = async ({
  aiNickname,
  aiPersonality,
}: {
  aiNickname: string | null;
  aiPersonality: string | null;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  await db
    .update(users)
    .set({
      aiNickname: aiNickname || null,
      aiPersonality: aiPersonality || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  revalidatePath("/settings");
};
