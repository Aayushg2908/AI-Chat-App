import {
  Calendar,
  HardDrive,
  Layers,
  Mail,
  MessageSquare,
  Palette,
  LucideIcon,
  Globe,
  Upload,
} from "lucide-react";

const getIcon = (icon: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    MessageSquare: MessageSquare,
    Layers: Layers,
    Palette: Palette,
    HardDrive: HardDrive,
    Calendar: Calendar,
    Mail: Mail,
    Globe: Globe,
    Upload: Upload,
  };

  return icons[icon] || MessageSquare;
};

const FeatureCard = ({
  title,
  description,
  icon,
  comingSoon,
}: {
  title: string;
  description: string;
  icon: string;
  comingSoon?: boolean;
}) => {
  const Icon = getIcon(icon);

  return (
    <div
      className={`p-4 rounded-lg border ${
        comingSoon
          ? "border-amber-200 bg-amber-50 dark:bg-amber-950/10 dark:border-amber-800"
          : "border-green-200 bg-green-50 dark:bg-green-950/10 dark:border-green-800"
      } transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-center mb-3">
        <div
          className={`p-2 rounded-full ${
            comingSoon
              ? "bg-amber-100 dark:bg-amber-900"
              : "bg-green-100 dark:bg-green-900"
          } mr-3`}
        >
          <Icon
            className={`h-5 w-5 ${
              comingSoon
                ? "text-amber-600 dark:text-amber-400"
                : "text-green-600 dark:text-green-400"
            }`}
          />
        </div>
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      {comingSoon && (
        <div className="mt-3">
          <span className="text-xs px-2 py-1 rounded-full bg-amber-200 text-amber-700 dark:bg-amber-800 dark:text-amber-200">
            Coming Soon
          </span>
        </div>
      )}
    </div>
  );
};

const FeaturesSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Available Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Chat with AI"
              description="Engage in natural conversations with our advanced AI assistants"
              icon="MessageSquare"
            />
            <FeatureCard
              title="Multiple Models"
              description="Choose from various AI models from a bunch of providers"
              icon="Layers"
            />
            <FeatureCard
              title="Canvas Mode"
              description="Create beautiful UI's with our Canvas Mode and preview them in real-time"
              icon="Palette"
            />
            <FeatureCard
              title="Web Search"
              description="AI can search the web for real-time information to answer your questions with the latest data"
              icon="Globe"
            />
            <FeatureCard
              title="File Uploads"
              description="Upload documents and files for the AI to analyze, summarize, and extract information from"
              icon="Upload"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Google Drive Integration"
              description="Connect and manage your cloud files directly from the app"
              icon="HardDrive"
              comingSoon
            />
            <FeatureCard
              title="Google Calendar Integration"
              description="Let AI manage your schedule and set up meetings intelligently"
              icon="Calendar"
              comingSoon
            />
            <FeatureCard
              title="Google Gmail Integration"
              description="Allow AI to help draft, organize, and respond to your emails"
              icon="Mail"
              comingSoon
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSettings;
