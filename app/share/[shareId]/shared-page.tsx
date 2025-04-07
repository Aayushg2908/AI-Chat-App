"use client";

import { cloneSharedThread } from "@/actions";
import ChatComponent from "@/components/chat";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLoginModal } from "@/hooks/use-login-modal";
import { cn } from "@/lib/utils";
import { Thread } from "@prisma/client";
import { User } from "better-auth";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const SharedPage = ({
  thread,
  user,
}: {
  thread: Thread;
  user: User | undefined;
}) => {
  const { isOpen, onOpen } = useLoginModal();
  const [isCloning, setIsCloning] = useState(false);
  const router = useRouter();

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
      setIsCloning(true);
      toast.promise(cloneSharedThread(thread.id), {
        loading: "Cloning thread...",
        success: (
          data:
            | { error: string; success?: undefined; threadId?: undefined }
            | { success: string; threadId: string; error?: undefined }
        ) => {
          if (data.success) {
            router.push(`/${data.threadId}`);
            return "Thread cloned successfully";
          }
          return "Failed to clone thread";
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clone this Thread.");
    } finally {
      setIsCloning(false);
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
          disabled={isCloning}
        >
          {isCloning && <Loader2Icon className="size-4 animate-spin" />}
          {isCloning ? "Cloning..." : "Clone this Thread"}
        </Button>
      </header>
      <ChatComponent thread={thread} isEditable={false} />
    </div>
  );
};

export default SharedPage;
