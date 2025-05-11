import Header from "./header";
import SettingsSidebar from "./sidebar";
import AccountSettings from "./account";
import CustomizationSettings from "./customization";
import ModelSettings from "./models";
import FeaturesSettings from "./features";
import FAQsSettings from "./faqs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAiCustomizations } from "@/actions";

const SettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    return redirect("/");
  }

  const aiCustomizations = await getAiCustomizations();

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden md:block">
            <SettingsSidebar user={session?.user} />
          </div>
          <div className="lg:col-span-3">
            <div className="bg-background border rounded-lg overflow-hidden">
              <Tabs defaultValue="account" className="w-full">
                <div className="border-b bg-card">
                  <TabsList className="h-12 bg-transparent p-0 rounded-none w-full justify-start">
                    <TabsTrigger
                      value="account"
                      className="data-[state=active]:bg-background rounded-none border-r px-6 h-full"
                    >
                      Account
                    </TabsTrigger>
                    <TabsTrigger
                      value="customization"
                      className="data-[state=active]:bg-background rounded-none border-r px-6 h-full"
                    >
                      Customization
                    </TabsTrigger>
                    <TabsTrigger
                      value="models"
                      className="data-[state=active]:bg-background rounded-none border-r px-6 h-full"
                    >
                      Models
                    </TabsTrigger>
                    <TabsTrigger
                      value="features"
                      className="data-[state=active]:bg-background rounded-none border-r px-6 h-full"
                    >
                      Features
                    </TabsTrigger>
                    <TabsTrigger
                      value="faqs"
                      className="data-[state=active]:bg-background rounded-none px-6 h-full"
                    >
                      FAQs
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-6">
                  <TabsContent value="account" className="mt-0">
                    <AccountSettings />
                  </TabsContent>
                  <TabsContent value="customization" className="mt-0">
                    <CustomizationSettings
                      aiCustomizations={aiCustomizations}
                    />
                  </TabsContent>
                  <TabsContent value="models" className="mt-0">
                    <ModelSettings />
                  </TabsContent>
                  <TabsContent value="features" className="mt-0">
                    <FeaturesSettings />
                  </TabsContent>
                  <TabsContent value="faqs" className="mt-0">
                    <FAQsSettings />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
