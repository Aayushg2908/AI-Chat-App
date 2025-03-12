"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
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
