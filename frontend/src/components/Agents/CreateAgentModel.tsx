import { useState } from "react";
import { UseCaseSelector } from "./UseCaseSelector";
import { AgentBuilder } from "./AgentBuilder";
import { X } from "lucide-react";

interface CreateAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated: (agent: any) => void;
}

type ModalStep = "select-mode" | "auto-build" | "builder";

export const CreateAgentModal = ({
  open,
  onOpenChange,
  onAgentCreated,
}: CreateAgentModalProps) => {
  const [step, setStep] = useState<ModalStep>("select-mode");
  const [buildMode, setBuildMode] = useState<"scratch" | "template" | null>(null);

  const handleClose = () => {
    setStep("select-mode");
    setBuildMode(null);
    onOpenChange(false);
  };

  const handleModeSelect = (mode: "scratch" | "template") => {
    setBuildMode(mode);
    if (mode === "template") {
      setStep("auto-build");
    } else {
      setStep("builder");
    }
  };

  const handleAutoBuildComplete = (agent: any) => {
    onAgentCreated(agent);
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" onClick={handleClose}>
      <div className="flex items-center justify-center min-h-screen py-10 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-5xl w-full max-h-[90vh] relative overflow-hidden flex flex-col">
          <button
            onClick={handleClose}
            className="absolute right-6 top-4 z-20 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-200 hover:border-gray-300"
          >
            <X className="h-5 w-5 text-gray-600 hover:text-gray-900" />
          </button>
          
          <div className="overflow-y-auto flex-1">
            {step === "select-mode" && (
              <UseCaseSelector
                onSelectMode={handleModeSelect}
                onClose={handleClose}
              />
            )}
            {step === "auto-build" && (
              <UseCaseSelector
                onSelectMode={handleModeSelect}
                onClose={handleClose}
                showAutoBuildForm={true}
                onAutoBuildComplete={handleAutoBuildComplete}
              />
            )}
            {step === "builder" && buildMode && (
              <AgentBuilder
                mode={buildMode}
                onClose={handleClose}
                onSave={(agent) => {
                  onAgentCreated(agent);
                  handleClose();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
