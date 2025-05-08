import Header from "./header";
import SettingsSidebar from "./sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    return redirect("/");
  }

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <SettingsSidebar user={session?.user} />
          <div className="md:col-span-3">Main Settings</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
