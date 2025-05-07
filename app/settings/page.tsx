import Image from "next/image";
import Header from "./header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const SettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-8">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden relative mb-4">
                {session?.user?.image ? (
                  <Image
                    src={session?.user?.image}
                    alt={session?.user?.name || "User"}
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-5xl font-medium text-white">
                    {session?.user?.name?.[0] || "A"}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold">
                {session?.user?.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email || ""}
              </p>
              <div className="mt-3">
                <span className="bg-neutral-800 text-sm px-3 py-1 rounded-full">
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
          <div className="md:col-span-3">Main Settings</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
