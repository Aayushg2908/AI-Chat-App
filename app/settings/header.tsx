"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { ArrowLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

const Header = () => {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <header className="flex items-center justify-between py-2 px-6">
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          className:
            "flex items-center gap-2 text-muted-foreground hover:text-foreground",
        })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to chat
      </Link>
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => startTransition(handleSignOut)}
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
    </header>
  );
};

export default Header;
