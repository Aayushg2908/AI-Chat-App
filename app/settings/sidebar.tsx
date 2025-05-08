import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User } from "better-auth";

const SettingsSidebar = ({ user }: { user: User }) => {
  return (
    <div className="md:col-span-1 space-y-8">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-28 h-28 rounded-full overflow-hidden relative mb-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.name || "User"}
              width={112}
              height={112}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-5xl font-medium text-white">
              {user?.name?.[0] || "A"}
            </div>
          )}
        </div>
        <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
        <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
        <div className="mt-2">
          <span className="bg-blue-800 text-sm px-3 py-1 rounded-full">
            Free Plan
          </span>
        </div>
      </div>
      <Card className="bg-zinc-900 border-gray-800">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">
            Keyboard Shortcuts
          </h3>
        </CardHeader>
        <CardContent className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Search</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                Ctrl
              </kbd>
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                K
              </kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">New Chat</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                Ctrl
              </kbd>
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                Shift
              </kbd>
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                O
              </kbd>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-200">Toggle Sidebar</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                Ctrl
              </kbd>
              <kbd className="px-2 py-1 bg-black/70 border border-gray-700 rounded text-xs text-white shadow-sm">
                B
              </kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSidebar;
