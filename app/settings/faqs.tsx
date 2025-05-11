import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQsSettings = () => {
  const faqs = [
    {
      question: "What AI models does your app support?",
      answer:
        "Our app supports a wide range of AI models from various providers:\n\n" +
        "• Google models: Gemini 2.0 Flash, Gemini 2.0 Pro, Gemini 2.0 Flash Lite, Gemini 2.0 Flash Thinking, Gemini 2.5 Flash, Gemini 2.5 Flash Thinking, Gemini 2.5 Pro, and Gemini 2.5 Pro Preview.\n\n" +
        "• OpenAI models: GPT-4o Mini, GPT-4o, GPT-4.1 Nano, GPT-4.1 Mini, GPT-4.1, O3 Mini, and O4 Mini.\n\n" +
        "• Groq hosted models: Deepseek R1 (llama distilled), Deepseek R1 (qwen distilled), Qwen 2.5, Qwen QWQ, and Llama 4 Scout.\n\n" +
        "We regularly update our supported models as new ones become available from these providers.",
    },
    {
      question: "How do I switch between different AI models?",
      answer:
        "You can easily switch between models by clicking on the model selector dropdown in the chat input. The dropdown shows your favorite models (up to 10) by default. To manage your favorite models, click 'More Models' in the dropdown, then use the toggle switches to add or remove models from your favorites list. Your selection is saved automatically and persists across sessions. Each chat thread can use a different model, and the app remembers which model you were using in each thread.",
    },
    {
      question: "Are there any usage limits for the AI models?",
      answer:
        "Usage limits vary depending on your subscription plan. Free users have a limited number of messages per day, while premium subscribers enjoy higher or unlimited usage. You can view your current usage and limits in your account dashboard.",
    },
    {
      question: "How accurate is the web search feature?",
      answer:
        "Our web search feature is available on select models (including all Google Gemini models, all OpenAI GPT models, and the O-series models) and provides real-time information from the web. While we strive for high accuracy, please verify critical information from official sources. You can enable web search by clicking the globe icon next to the model selector when using a compatible model.",
    },
    {
      question: "What file types can I upload for AI analysis?",
      answer:
        "File uploads are supported on most models including Gemini series, GPT series, and Llama 4 Scout. You can upload various file formats including images (JPG, PNG), PDFs, DOCs, TXTs, CSVs, markdown files (.md), code files (.json, .js, .py, .html, .css, .tsx, .jsx, .ts), and more. There's a 25MB file size limit per upload. To upload a file, click the upload icon next to the model selector when using a compatible model.",
    },
    {
      question: "How does Canvas Mode work?",
      answer:
        "Canvas Mode allows you to design UI interfaces by describing what you want in natural language. The AI generates the code using the shadcn component library, which you can then preview, edit, and export for your projects.",
    },
    {
      question:
        "When will the Google integrations (Drive, Calendar, Gmail) be available?",
      answer:
        "We're actively working on integrations with Google services. While we don't have an exact release date, these features are high on our priority list and should be available in the coming months. You can subscribe to our newsletter for updates.",
    },
    {
      question: "Can I use the app offline?",
      answer:
        "Currently, our app requires an internet connection to function as it needs to communicate with our AI servers. However, we're exploring options for limited offline functionality in future updates.",
    },
    {
      question: "How do I report issues or suggest features?",
      answer:
        "You can report issues or suggest new features through the feedback form in the Settings section or by emailing our support team. We value user feedback and actively incorporate suggestions into our development roadmap.",
    },
    {
      question: "What special capabilities do different models have?",
      answer:
        "Our models have different capabilities indicated by icons in the model selector:\n\n" +
        "• Web Search (Globe icon): Models that can search the web for real-time information\n" +
        "• File Upload (Document icon): Models that can analyze uploaded files\n" +
        "• Reasoning (Brain icon): Models with enhanced reasoning capabilities like Gemini 2.5 Pro, O3 Mini, O4 Mini, and various Groq models\n" +
        "• Very Fast (Lightning icon): Our fastest responding models like Gemini Flash Lite and GPT-4.1 Nano\n" +
        "• Experimental (Flask icon): Cutting-edge models that are still being improved",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <p className="text-muted-foreground mb-6">
        Find answers to common questions about our AI Chat App features and
        capabilities.
      </p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQsSettings;
