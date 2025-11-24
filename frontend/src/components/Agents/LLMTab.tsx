import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, ExternalLink, Trash2, Edit2 } from "lucide-react";
import GradientSlider from "./GradientSlider";

interface LLMTabProps {
  data: any;
  onChange: (data: any) => void;
}

interface FAQBlock {
  id: string;
  name: string;
  response: string;
  threshold: number;
  utterances: string[];
}

// Define model variants for each provider
const MODEL_VARIANTS: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
    { value: "gpt-4.1", label: "gpt-4.1" },
    { value: "gpt-4.1-nano", label: "gpt-4.1-nano" },
    { value: "gpt-4o-mini", label: "gpt-4o-mini" },
    { value: "gpt-4o", label: "gpt-4o" },
    { value: "gpt-4", label: "gpt-4" },
    { value: "gpt-3.5-turbo", label: "gpt-3.5-turbo" },
  ],
  azure: [
    { value: "gpt-4.1-mini cluster", label: "gpt-4.1-mini cluster" },
    { value: "gpt-4.1 cluster", label: "gpt-4.1 cluster" },
    { value: "gpt-4.1-nano cluster", label: "gpt-4.1-nano cluster" },
    { value: "gpt-4o-mini cluster", label: "gpt-4o-mini cluster" },
    { value: "gpt-4o cluster", label: "gpt-4o cluster" },
    { value: "gpt-4 cluster", label: "gpt-4 cluster" },
    { value: "gpt-3.5 cluster", label: "gpt-3.5 cluster" },
  ],
  openrouter: [
    { value: "gpt-oss-20b", label: "gpt-oss-20b" },
    { value: "gpt-oss-120b", label: "gpt-oss-120b" },
    { value: "gpt-4", label: "gpt-4" },
    { value: "gpt-4o-mini", label: "gpt-4o-mini" },
    { value: "gpt-4o", label: "gpt-4o" },
    { value: "gpt-4.1", label: "gpt-4.1" },
    { value: "gpt-4.1-nano", label: "gpt-4.1-nano" },
    { value: "gpt-4.1-mini", label: "gpt-4.1-mini" },
    { value: "Claude sonnet-4", label: "Claude sonnet-4" },
  ],
  deepseek: [
    { value: "deepseek-chat", label: "deepseek-chat" },
  ],
  anthropic: [
    { value: "sonnet-4", label: "sonnet-4" },
  ],
};

// Define default variant for each provider
const DEFAULT_VARIANTS: Record<string, string> = {
  openai: "gpt-4.1-mini",
  azure: "gpt-4.1-mini cluster",
  openrouter: "gpt-oss-20b",
  deepseek: "deepseek-chat",
  anthropic: "sonnet-4",
};

export const LLMTab = ({ data, onChange }: LLMTabProps) => {
  const currentProvider = data.llmModel || "openai";
  const currentVariant = data.llmVariant || DEFAULT_VARIANTS[currentProvider];
  const [showFaqsModal, setShowFaqsModal] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [savedFaqs, setSavedFaqs] = useState<FAQBlock[]>(data.faqsList || []);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [faqsData, setFaqsData] = useState({
    name: "",
    response: "",
    threshold: 0.9,
    utterances: [""],
  });

  // Get available variants for the current provider
  const availableVariants = useMemo(() => {
    return MODEL_VARIANTS[currentProvider] || [];
  }, [currentProvider]);

  // When provider changes, update the variant to the default for that provider
  useEffect(() => {
    if (!data.llmVariant || !MODEL_VARIANTS[currentProvider]?.some(v => v.value === data.llmVariant)) {
      const defaultVariant = DEFAULT_VARIANTS[currentProvider];
      if (defaultVariant) {
        onChange({ llmVariant: defaultVariant });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvider, data.llmVariant]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value;
    const defaultVariant = DEFAULT_VARIANTS[newProvider];
    onChange({ llmModel: newProvider, llmVariant: defaultVariant });
  };

  const handleAddUtterance = () => {
    if (faqsData.utterances.length < 20) {
      setFaqsData({ ...faqsData, utterances: [...faqsData.utterances, ""] });
    }
  };

  const handleRemoveUtterance = (index: number) => {
    const newUtterances = faqsData.utterances.filter((_, i) => i !== index);
    setFaqsData({ ...faqsData, utterances: newUtterances });
  };

  const handleUtteranceChange = (index: number, value: string) => {
    const newUtterances = [...faqsData.utterances];
    newUtterances[index] = value;
    setFaqsData({ ...faqsData, utterances: newUtterances });
  };

  const handleEditFaq = (faq: FAQBlock) => {
    setEditingFaqId(faq.id);
    setFaqsData({
      name: faq.name,
      response: faq.response,
      threshold: faq.threshold,
      utterances: faq.utterances.length > 0 ? faq.utterances : [""],
    });
    setShowFaqsModal(true);
    setValidationErrors({});
  };

  const handleSaveFaqs = () => {
    const errors: any = {};
    
    // Validate required fields
    if (!faqsData.name || faqsData.name.trim() === "") {
      errors.name = "Name is required";
    }
    if (!faqsData.response || faqsData.response.trim() === "") {
      errors.response = "Response is required";
    }
    
    // If there are errors, show them and don't save
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    let updatedFaqs: FAQBlock[];
    if (editingFaqId) {
      // Update existing FAQ
      updatedFaqs = savedFaqs.map(faq => 
        faq.id === editingFaqId 
          ? {
              id: faq.id,
              name: faqsData.name,
              response: faqsData.response,
              threshold: faqsData.threshold,
              utterances: faqsData.utterances.filter(u => u.trim() !== ""),
            }
          : faq
      );
    } else {
      // Save new FAQ
      const newFaq: FAQBlock = {
        id: Date.now().toString(),
        name: faqsData.name,
        response: faqsData.response,
        threshold: faqsData.threshold,
        utterances: faqsData.utterances.filter(u => u.trim() !== ""),
      };
      updatedFaqs = [...savedFaqs, newFaq];
    }
    
    setSavedFaqs(updatedFaqs);
    // Update agentData with FAQs
    onChange({ faqsList: updatedFaqs });
    
    setShowFaqsModal(false);
    setEditingFaqId(null);
    setValidationErrors({});
    setFaqsData({
      name: "",
      response: "",
      threshold: 0.9,
      utterances: [""],
    });
  };

  const handleCancelFaqs = () => {
    setShowFaqsModal(false);
    setEditingFaqId(null);
    setValidationErrors({});
    setFaqsData({
      name: "",
      response: "",
      threshold: 0.9,
      utterances: [""],
    });
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = savedFaqs.filter(faq => faq.id !== id);
    setSavedFaqs(updatedFaqs);
    // Update agentData when FAQ is deleted
    onChange({ faqsList: updatedFaqs });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-6 text-gray-900">LLM Configuration</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="llm-model" className="text-base font-semibold text-gray-900 block mb-2">Model</label>
            <select
              id="llm-model"
              value={currentProvider}
              onChange={handleProviderChange}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
            >
              <option value="openai">Openai</option>
              <option value="azure">Azure</option>
              <option value="openrouter">Openrouter</option>
              <option value="deepseek">Deepseek</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="llm-variant" className="text-base font-semibold text-gray-900 block mb-2">Model Variant</label>
            <select
              id="llm-variant"
              value={currentVariant}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ llmVariant: e.target.value })}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
            >
              {availableVariants.map((variant) => (
                <option key={variant.value} value={variant.value}>
                  {variant.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <GradientSlider
          label="Tokens generated on each LLM output"
          value={data.tokens || 1000}
          onChange={(value: number) => onChange({ tokens: value })}
          min={1}
          max={4096}
          step={1}
          unit=" tokens"
          description="Increasing tokens enables longer responses for richer AI-craft but increases latency"
        />
      </div>

      <div className="space-y-3">
        <GradientSlider
          label="Temperature"
          value={data.temperature || 0.2}
          onChange={(value: number) => onChange({ temperature: value })}
          min={0.01}
          max={1}
          step={0.01}
          description="Increasing temperature enables heightened creativity, but increases chance of deviation from prompt"
        />
      </div>

      <div className="space-y-2">
        <label className="text-base font-semibold text-gray-900 block mb-2">Add knowledge base</label>
        <select
          value={data.knowledgeBase || "none"}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ knowledgeBase: e.target.value })}
          className="w-full h-12 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
        >
          <option value="none">None</option>
          <option value="custom">Custom Knowledge Base</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-base font-semibold text-gray-900">Add FAQs & Guardrails</label>
          <a href="#" className="text-sm text-[#4F46E5] hover:underline flex items-center gap-1">
            Learn more <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        
        {/* Display Saved FAQs */}
        {savedFaqs.length > 0 && (
          <div className="space-y-2 mb-3">
            {savedFaqs.map((faq) => (
              <div key={faq.id} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleEditFaq(faq)}>
                <div className="flex items-center gap-2 flex-1 text-sm text-gray-900">
                  <Edit2 className="h-4 w-4" />
                  Edit block for {faq.name}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFaq(faq.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button
          type="button"
          onClick={() => {
            setEditingFaqId(null);
            setFaqsData({
              name: "",
              response: "",
              threshold: 0.9,
              utterances: [""],
            });
            setValidationErrors({});
            setShowFaqsModal(true);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add a new block for FAQs & Guardrails
        </button>
      </div>

      {/* FAQs Modal */}
      {showFaqsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Add FAQs & Guardrails</h3>
                <button
                  onClick={handleCancelFaqs}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Name Field */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  placeholder="Block name for FAQs & Guardrails"
                  value={faqsData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFaqsData({ ...faqsData, name: e.target.value });
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: undefined });
                    }
                  }}
                  className={`w-full bg-white border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 placeholder:text-gray-400 mt-1.5 ${
                    validationErrors.name 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  }`}
                />
                {validationErrors.name ? (
                  <p className="text-xs text-red-600 mt-1.5">{validationErrors.name}</p>
                ) : (
                  <p className="text-xs text-gray-600 mt-1.5">Put a name for this block</p>
                )}
              </div>

              {/* Response Field */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Response <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  placeholder="Forced responses for the given threshold and messages"
                  value={faqsData.response}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFaqsData({ ...faqsData, response: e.target.value });
                    if (validationErrors.response) {
                      setValidationErrors({ ...validationErrors, response: undefined });
                    }
                  }}
                  className={`w-full bg-white border rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 placeholder:text-gray-400 mt-1.5 ${
                    validationErrors.response 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                  }`}
                />
                {validationErrors.response ? (
                  <p className="text-xs text-red-600 mt-1.5">{validationErrors.response}</p>
                ) : (
                  <p className="text-xs text-gray-600 mt-1.5">Put a response for this block rule</p>
                )}
              </div>

              {/* Threshold Field */}
              <div>
                <GradientSlider
                  label="Threshold for this rule"
                  value={faqsData.threshold}
                  onChange={(value: number) => setFaqsData({ ...faqsData, threshold: value })}
                  min={0.7}
                  max={1}
                  step={0.05}
                  description="A lower threshold increases the likelihood that sentences similar to the utterances will trigger this response, but it also raises the risk of unintended sentences matching this response"
                />
              </div>

              {/* Utterances Field */}
              <div>
                <label className="text-sm font-semibold text-gray-900 block mb-2">Utterances</label>
                <div className="space-y-2">
                  {faqsData.utterances.map((utterance, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={utterance}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUtteranceChange(index, e.target.value)}
                        className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
                      />
                      {faqsData.utterances.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUtterance(index)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {faqsData.utterances.length < 20 && (
                  <button
                    type="button"
                    onClick={handleAddUtterance}
                    className="mt-2 text-sm text-[#4F46E5] hover:underline"
                  >
                    Add more (up to 20)
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelFaqs}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveFaqs}
                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-2 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
