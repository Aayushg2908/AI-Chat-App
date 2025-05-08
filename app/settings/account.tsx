"use client";

import { Button } from "@/components/ui/button";

const AccountSettings = () => {
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
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
