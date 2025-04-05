"use client";

import ChatComponent from "@/components/chat";
import { useLoginModal } from "@/hooks/use-login-modal";
import { Thread } from "@prisma/client";
import { User } from "better-auth";
import { useEffect } from "react";

const SharedPage = ({
  thread,
  user,
}: {
  thread: Thread;
  user: User | undefined;
}) => {
  const { isOpen, onOpen } = useLoginModal();

  useEffect(() => {
    if (thread.requireAuth && !user) {
      onOpen();
    }
  }, [thread.requireAuth, onOpen]);

  if (isOpen) return null;

  return <ChatComponent thread={thread} isEditable={false} />;
};

export default SharedPage;
