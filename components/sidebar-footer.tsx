"use client";

import { useSession, signIn } from "@/lib/auth-client";
import { LoaderIcon, LogInIcon, SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const SidebarFooterComponent = () => {
  const { data, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (isPending) {
    return <div className="mx-auto">Loading...</div>;
  }

  if (!data?.user.id) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold ml-2">Login</div>
        {isLoading ? (
          <LoaderIcon className="size-5 cursor-pointer mr-2 animate-spin" />
        ) : (
          <LogInIcon
            onClick={async () => {
              setIsLoading(true);
              await signIn.social({
                provider: "google",
              });
              setIsLoading(false);
            }}
            className="size-5 cursor-pointer mr-2"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-1">
        <Image
          src={data.user.image!}
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="flex flex-col justify-center">
          <div className="font-semibold">{data.user.name}</div>
          <div className="text-xs">{data.user.email}</div>
        </div>
      </div>
      <SettingsIcon className="size-5 cursor-pointer mr-2" />
    </div>
  );
};

export default SidebarFooterComponent;
