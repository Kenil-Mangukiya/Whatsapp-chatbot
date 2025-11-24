import { useState } from "react";
import {
  Bot,
  Sparkles,
  Users,
  UserCheck,
  HeadphonesIcon,
  Megaphone,
  ClipboardCheck,
  Calendar,
  ShoppingCart,
  X,
} from "lucide-react";

interface UseCaseSelectorProps {
  onSelectMode: (mode: "scratch" | "template") => void;
  onClose: () => void;
  showAutoBuildForm?: boolean;
  onAutoBuildComplete?: (agent: any) => void;
}

const templates = [
  {
    icon: Users,
    title: "Recruitment Agent",
    description: "AI agent that screens, interviews, and onboard candidates at scale",
  },
  {
    icon: UserCheck,
    title: "Lead Qualification Agent",
    description: "Calls every lead to ask qualifying questions, answer FAQs, and book meetings",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support Agent",
    description: "Provides 24/7 bilingual call answering for FAQs and customer triage",
  },
  {
    icon: Calendar,
    title: "Onboarding Agent",
    description: "Conducts personalized guidance calls to warmly onboard new users",
  },
  {
    icon: ClipboardCheck,
    title: "Reminder Agent",
    description: "Automates reminders, from RMNs and collections, to form filling deadlines",
  },
  {
    icon: Megaphone,
    title: "Announcement Agent",
    description: "Keeps users engaged with all feature upgrades and product launches",
  },
  {
    icon: ClipboardCheck,
    title: "Survey Agent",
    description: "Automates NPS, feedback & product surveys with detailed personalized questioning",
  },
  {
    icon: Calendar,
    title: "Front Desk Agent",
    description: "Answers every call to handle clinic, hotel, and office front desk scheduling",
  },
  {
    icon: ShoppingCart,
    title: "Cart Abandonment Agent",
    description: "Calls customers with abandoned items in carts, recovering lost sales",
  },
  {
    icon: ClipboardCheck,
    title: "COD Confirmation Agent",
    description: "Handles cash on delivery order confirmations, saving manual human effort",
  },
];

export const UseCaseSelector = ({
  onSelectMode,
  onClose,
  showAutoBuildForm = false,
  onAutoBuildComplete,
}: UseCaseSelectorProps) => {
  const [formData, setFormData] = useState({
    name: "",
    languages: [] as string[],
    callGoal: "",
    nextSteps: "",
    faqs: "",
    transcript: "",
  });

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleGenerateAgent = () => {
    const agent = {
      id: Date.now().toString(),
      name: formData.name || "Auto-Built Agent",
      useCase: "Auto-Built Agent",
      status: "active" as const,
    };
    onAutoBuildComplete?.(agent);
  };

  if (showAutoBuildForm) {
    return (
      <div className="p-8 bg-white">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Select your use case and let AI build your agent</h2>
        <p className="text-gray-600 mb-8">You can always modify it later</p>

        <div className="space-y-6 max-w-2xl">
          <div>
            <label htmlFor="agent-name" className="text-base font-semibold text-gray-900 block mb-2">Name of Agent *</label>
            <input
              id="agent-name"
              type="text"
              placeholder="Enter agent name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="text-base font-semibold text-[#F8F8FF] block mb-2">Languages *</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.languages.includes("English")}
                  onChange={() => handleLanguageToggle("English")}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">English</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.languages.includes("Hindi")}
                  onChange={() => handleLanguageToggle("Hindi")}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-gray-700">Hindi</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="call-goal" className="text-base font-semibold text-gray-900 block mb-2">What do you want to achieve in this call? *</label>
            <textarea
              id="call-goal"
              placeholder="Ex: describe as you would to a human who you are talking to lead the call..."
              value={formData.callGoal}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, callGoal: e.target.value })}
              className="w-full min-h-[100px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y"
            />
          </div>

          <div>
            <label htmlFor="next-steps" className="text-base font-semibold text-gray-900 block mb-2">Ideal Next Steps after the call *</label>
            <textarea
              id="next-steps"
              placeholder="Describe what should happen after the call is completed..."
              value={formData.nextSteps}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, nextSteps: e.target.value })}
              className="w-full min-h-[100px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y"
            />
          </div>

          <div>
            <label htmlFor="faqs" className="text-base font-semibold text-gray-900 block mb-2">FAQs / Business Documents / Any information</label>
            <textarea
              id="faqs"
              placeholder="Add any relevant FAQs, business documents, or additional information..."
              value={formData.faqs}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, faqs: e.target.value })}
              className="w-full min-h-[100px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y"
            />
          </div>

          <div>
            <label htmlFor="transcript" className="text-base font-semibold text-gray-900 block mb-2">Sample Transcript</label>
            <textarea
              id="transcript"
              placeholder="Provide a sample conversation transcript to help guide the agent..."
              value={formData.transcript}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, transcript: e.target.value })}
              className="w-full min-h-[100px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y"
            />
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-[#4F46E5] transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateAgent}
              className="px-6 py-3 bg-[#4F46E5] text-white font-semibold rounded-lg shadow-lg hover:bg-[#4338CA] transition-all duration-200 hover:scale-[1.02]"
            >
              Generate Agent
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button
            onClick={() => onSelectMode("scratch")}
            className="text-sm text-gray-600 hover:text-[#4F46E5] transition-colors"
          >
            I want to create an agent from scratch
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
          Select your use case and let AI build your agent
        </h2>
        <p className="text-gray-600 text-center mb-8">
          You can always modify & edit it later.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onSelectMode("scratch")}
            className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-[#4F46E5] hover:shadow-lg transition-all duration-200 text-left bg-white"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
                <Bot className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Build Agent</h3>
            </div>
          </button>

          <button
            onClick={() => onSelectMode("template")}
            className="group relative p-6 border-2 border-[#4F46E5] rounded-xl hover:shadow-lg transition-all duration-200 text-left bg-[#4F46E5]/5"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center group-hover:bg-[#4F46E5]/20 transition-colors">
                <Sparkles className="h-6 w-6 text-[#4F46E5]" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900">Pre built Agents</h3>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <button
                  key={index}
                  onClick={() => onSelectMode("template")}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all duration-200 text-left bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center group-hover:bg-[#4F46E5]/10 transition-colors flex-shrink-0">
                      <Icon className="h-4 w-4 text-gray-600 group-hover:text-[#4F46E5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm mb-1 text-gray-900">
                        {template.title}
                      </h4>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onSelectMode("scratch")}
            className="text-sm text-[#4F46E5] hover:underline"
          >
            I want to create an agent from scratch
          </button>
        </div>
      </div>
    </div>
  );
};
