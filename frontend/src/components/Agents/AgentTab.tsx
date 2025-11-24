import React from "react";

interface AgentTabProps {
  data: any;
  onChange: (data: any) => void;
  errors?: any;
}

export const AgentTab = ({ data, onChange, errors = {} }: AgentTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Agent Configuration</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="agent-name" className="text-sm font-semibold text-gray-900 block mb-2">Name of Agent <span className="text-red-600">*</span></label>
            <input
              id="agent-name"
              type="text"
              placeholder="Enter agent name"
              value={data.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ name: e.target.value })}
              className={cn(
                "w-full bg-white border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:border-[#4F46E5] placeholder:text-gray-400 mt-1.5",
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#4F46E5]"
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="welcome-message" className="text-sm font-semibold text-gray-900 block mb-2">Welcome Message</label>
            <input
              id="welcome-message"
              type="text"
              placeholder="Hello from Bolna"
              value={data.welcomeMessage || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ welcomeMessage: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 mt-1.5"
            />
            <p className="text-xs text-gray-600 mt-1.5">
              This will be the initial message from the agent. You can use variables here
              {" "}(available [variable names])
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="prompt" className="text-sm font-semibold text-gray-900">Prompt <span className="text-red-600">*</span></label>
              <button className="text-xs text-[#4F46E5] hover:underline">
                AI Edit
              </button>
            </div>
            <textarea
              id="prompt"
              placeholder="Describe your agent's personality and behavior..."
              value={data.prompt || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ prompt: e.target.value })}
              className={cn(
                "w-full min-h-[200px] font-mono text-sm bg-white border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:border-[#4F46E5] placeholder:text-gray-400 resize-y",
                errors.prompt ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#4F46E5]"
              )}
            />
            {errors.prompt && (
              <p className="text-xs text-red-600 mt-1.5">{errors.prompt}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
