"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

const SignOutButton = () => {
  return (
    <Button
      onClick={async () => {
        toast.promise(
          signOut({
            fetchOptions: {
              onSuccess: () => {
                window.location.reload();
              },
            },
          }),
          {
            loading: "Signing out...",
            success: "Signed out successfully",
            error: "Failed to sign out",
          }
        );
      }}
      className="mt-1"
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
