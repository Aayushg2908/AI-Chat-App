"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const signOutMutation = useMutation({
    mutationFn: async () =>
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      }),
  });

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
        disabled={signOutMutation.isPending}
        onClick={() => signOutMutation.mutate()}
      >
        {signOutMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {signOutMutation.isPending ? "Signing out..." : "Sign out"}
      </Button>
    </header>
  );
};

export default Header;
