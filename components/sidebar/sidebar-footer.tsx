"use client";

import { signOut } from "@/lib/auth-client";
import {
  LogInIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  LaptopIcon,
  LogOutIcon,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLoginModal } from "@/hooks/use-login-modal";
import { User } from "better-auth";

const SidebarFooterComponent = ({ session }: { session: User | undefined }) => {
  const { setTheme } = useTheme();
  const { onOpen } = useLoginModal();

  if (!session?.id) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold ml-2">Login</div>
        <LogInIcon
          onClick={() =>
            onOpen(
              "Sign in to your account to access your chat history, settings and much more.",
              ""
            )
          }
          className="size-5 cursor-pointer mr-2"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-1">
        <Image
          src={session.image!}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center">
          <div className="font-semibold">{session.name}</div>
          <div className="text-xs">{session.email}</div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SettingsIcon className="size-5 cursor-pointer mr-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[150px] p-1 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg shadow-lg"
        >
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center gap-2">
              <SettingsIcon className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
              <SunIcon className="size-4" />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-1 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg shadow-lg">
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <SunIcon className="size-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <MoonIcon className="size-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("system")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LaptopIcon className="size-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () =>
              await signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              })
            }
            className="flex items-center gap-2 cursor-pointer"
          >
            <LogOutIcon className="size-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SidebarFooterComponent;
