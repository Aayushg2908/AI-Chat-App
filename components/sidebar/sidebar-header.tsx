import { handleUserRedirect } from "@/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Loader2,
  MessageCircleMore,
  SearchIcon,
  SquarePen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ThreadType } from "@/db/schema";

const SidebarHeaderComponent = ({ threads }: { threads: ThreadType[] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        handleNewChat();
      } else if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleNewChat = async () => {
    try {
      setLoading(true);
      await handleUserRedirect();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-[22px] font-bold">ALLIN1</h1>
        <div className="flex items-center gap-x-4">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild onClick={() => setOpen(true)}>
                <SearchIcon className="size-5 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 text-white">
                Search (Ctrl+K)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                {loading ? (
                  <Loader2 className="size-5 cursor-pointer animate-spin" />
                ) : (
                  <SquarePen
                    onClick={handleNewChat}
                    className="size-5 cursor-pointer"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-800 text-white">
                New Chat (Ctrl+Shift+O)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for your Threads..." />
        <CommandList>
          <CommandEmpty>No Threads found.</CommandEmpty>
          <CommandGroup heading="Threads">
            {threads.map((thread) => (
              <CommandItem
                key={thread.id}
                value={thread.title}
                className="cursor-pointer"
                onSelect={() => {
                  setOpen(false);
                  router.push(`/${thread.id}`);
                }}
              >
                <MessageCircleMore className="size-5" />
                <span className="truncate">{thread.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SidebarHeaderComponent;
