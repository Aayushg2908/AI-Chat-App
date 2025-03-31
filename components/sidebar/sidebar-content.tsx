"use client";

import Link from "next/link";
import { Thread } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Pin,
  Trash2,
  ChevronUpIcon,
  PinOff,
} from "lucide-react";
import { SidebarGroup, SidebarGroupContent } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { deleteThread, editThread, pinThread, unpinThread } from "@/actions";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const categorizeThreads = (threads: Thread[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const pinnedThreads: Thread[] = [];
  const newChatThreads: Thread[] = [];
  const todayThreads: Thread[] = [];
  const yesterdayThreads: Thread[] = [];
  const previousThreads: Thread[] = [];

  threads.forEach((thread) => {
    if (thread.pinned) {
      pinnedThreads.push(thread);
      return;
    }

    if (!thread.messages) {
      newChatThreads.push(thread);
      return;
    }

    const threadDate = new Date(thread.updatedAt);
    threadDate.setHours(0, 0, 0, 0);

    if (threadDate.getTime() === today.getTime()) {
      todayThreads.push(thread);
    } else if (threadDate.getTime() === yesterday.getTime()) {
      yesterdayThreads.push(thread);
    } else {
      previousThreads.push(thread);
    }
  });

  pinnedThreads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  todayThreads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  yesterdayThreads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  previousThreads.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const sortedTodayThreads = [...newChatThreads, ...todayThreads];

  return {
    pinnedThreads,
    todayThreads: sortedTodayThreads,
    yesterdayThreads,
    previousThreads,
  };
};

const ThreadItem = ({
  thread,
  threadId,
  threadRefs,
  onEdit,
  onDelete,
  handlePin,
  handleUnpin,
}: {
  thread: Thread;
  threadId: string;
  threadRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  onEdit: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  handlePin: (id: string) => Promise<void>;
  handleUnpin: (id: string) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarGroupContent
      key={thread.id}
      ref={(el) => {
        if (el) threadRefs.current.set(thread.id, el);
      }}
      className={cn(
        "relative group/thread px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors mb-2",
        threadId === thread.id &&
          "bg-sidebar-accent text-sidebar-accent-foreground"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <Link
          href={`/${thread.id}`}
          className={cn(
            "flex-1 truncate",
            threadId === thread.id && "font-bold"
          )}
        >
          {thread.title}
        </Link>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="opacity-0 group-hover/thread:opacity-100 focus:opacity-100 transition-opacity">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="p-1 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg shadow-lg"
            sideOffset={5}
          >
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DropdownMenuItem
                className="cursor-pointer flex items-center my-0.5 rounded-md transition-colors duration-150 hover:dark:bg-zinc-800 hover:bg-zinc-100"
                onClick={() => onEdit(thread.id, thread.title)}
              >
                <Pencil className="size-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center my-0.5 rounded-md transition-colors duration-150 hover:dark:bg-zinc-800 hover:bg-zinc-100"
                onClick={async () => {
                  if (thread.pinned) {
                    await handleUnpin(thread.id);
                  } else {
                    await handlePin(thread.id);
                  }
                }}
              >
                {thread.pinned ? (
                  <>
                    <PinOff className="size-4 mr-2" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="size-4 mr-2" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center my-0.5 rounded-md transition-colors duration-150 hover:dark:bg-zinc-800 hover:bg-zinc-100 text-red-500 focus:text-red-500"
                onClick={() => onDelete(thread.id)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarGroupContent>
  );
};

const SidebarContentComponent = ({ threads }: { threads: Thread[] }) => {
  const params = useParams();
  const threadId = params?.threadId as string;
  const [deleteThreadId, setDeleteThreadId] = useState<string | null>(null);
  const [editThreadId, setEditThreadId] = useState<string | null>(null);
  const [editThreadTitle, setEditThreadTitle] = useState("");
  const router = useRouter();

  const threadRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { pinnedThreads, todayThreads, yesterdayThreads, previousThreads } =
    categorizeThreads(threads);

  useEffect(() => {
    if (threadId && threadRefs.current.has(threadId)) {
      const activeThreadElement = threadRefs.current.get(threadId);
      if (activeThreadElement) {
        activeThreadElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [threadId]);

  const handleEdit = async () => {
    if (!editThreadId) return;
    try {
      if (!editThreadTitle) {
        toast.error("Thread title cannot be empty");
        return;
      }
      toast.promise(editThread(editThreadId, editThreadTitle), {
        loading: "Renaming thread...",
        success: "Thread renamed successfully",
        error: "Failed to rename thread",
      });
      setEditThreadId(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to rename thread");
    }
  };

  const handleDelete = async () => {
    if (!deleteThreadId) return;
    try {
      toast.promise(deleteThread(deleteThreadId), {
        loading: "Deleting thread...",
        success: "Thread deleted successfully",
        error: "Failed to delete thread",
      });
      setDeleteThreadId(null);
      if (deleteThreadId === threadId) {
        router.push("/");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete thread");
    }
  };

  const handleEditStart = (id: string, title: string) => {
    setEditThreadId(id);
    setEditThreadTitle(title);
  };

  const handlePin = async (id: string) => {
    try {
      toast.promise(pinThread(id), {
        loading: "Pinning thread...",
        success: "Thread pinned successfully",
        error: "Failed to pin thread",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to pin thread");
    }
  };

  const handleUnpin = async (id: string) => {
    try {
      toast.promise(unpinThread(id), {
        loading: "Unpinning thread...",
        success: "Thread unpinned successfully",
        error: "Failed to unpin thread",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to unpin thread");
    }
  };

  return (
    <>
      {pinnedThreads.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 px-3 flex items-center">
            <Pin className="size-3 mr-1" /> Pinned
          </h3>
          <SidebarGroup>
            {pinnedThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                threadId={threadId}
                threadRefs={threadRefs}
                onEdit={handleEditStart}
                onDelete={setDeleteThreadId}
                handlePin={handlePin}
                handleUnpin={handleUnpin}
              />
            ))}
          </SidebarGroup>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">Today</h3>
        <SidebarGroup>
          {todayThreads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              threadId={threadId}
              threadRefs={threadRefs}
              onEdit={handleEditStart}
              onDelete={setDeleteThreadId}
              handlePin={handlePin}
              handleUnpin={handleUnpin}
            />
          ))}
        </SidebarGroup>
      </div>

      {yesterdayThreads.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">
            Yesterday
          </h3>
          <SidebarGroup>
            {yesterdayThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                threadId={threadId}
                threadRefs={threadRefs}
                onEdit={handleEditStart}
                onDelete={setDeleteThreadId}
                handlePin={handlePin}
                handleUnpin={handleUnpin}
              />
            ))}
          </SidebarGroup>
        </div>
      )}

      {previousThreads.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2 px-3">
            Previous
          </h3>
          <SidebarGroup>
            {previousThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                threadId={threadId}
                threadRefs={threadRefs}
                onEdit={handleEditStart}
                onDelete={setDeleteThreadId}
                handlePin={handlePin}
                handleUnpin={handleUnpin}
              />
            ))}
          </SidebarGroup>
        </div>
      )}

      <AlertDialog
        open={deleteThreadId !== null}
        onOpenChange={() => setDeleteThreadId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              thread
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={editThreadId !== null}
        onOpenChange={() => setEditThreadId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thread</DialogTitle>
            <DialogDescription>Edit the title of your thread</DialogDescription>
          </DialogHeader>
          <Input
            value={editThreadTitle}
            onChange={(e) => setEditThreadTitle(e.target.value)}
            placeholder="Enter new thread title"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditThreadId(null);
                setEditThreadTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SidebarContentComponent;
