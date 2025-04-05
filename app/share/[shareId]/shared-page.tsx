"use client";

import ChatComponent from "@/components/chat";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLoginModal } from "@/hooks/use-login-modal";
import { cn } from "@/lib/utils";
import { Thread } from "@prisma/client";
import { User } from "better-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

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
      onOpen(
        "Please login to view this thread or ask the owner to make it public."
      );
    }
  }, [thread.requireAuth, onOpen]);

  if (isOpen) return null;

  const handleCloneThread = async () => {
    try {
      console.log("Cloned this Thread.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clone this Thread.");
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <header className="flex items-center justify-between mx-4 h-[50px]">
        <Link
          href="/"
          className={cn(
            buttonVariants({
              variant: "ghost",
            })
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Button
          onClick={handleCloneThread}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Clone this Thread
        </Button>
      </header>
      <ChatComponent thread={thread} isEditable={false} />
    </div>
  );
};

export default SharedPage;
