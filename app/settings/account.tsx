"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { deleteAccount } from "@/actions";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

const AccountSettings = () => {
  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      toast.success("Account deleted successfully");
      window.location.href = "/";
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-black/90 p-3 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Danger Zone</h2>
        <p className="text-gray-400 mb-6">
          Permanently delete your account and all associated data.
        </p>
        <Button
          variant="destructive"
          className="bg-red-900 hover:bg-red-800 text-white"
          onClick={() => deleteAccountMutation.mutate()}
          disabled={deleteAccountMutation.isPending}
        >
          {deleteAccountMutation.isPending && (
            <Loader2Icon className="mr-2 size-4 animate-spin" />
          )}
          {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
