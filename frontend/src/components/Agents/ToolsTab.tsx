import React from "react";
import { Plus } from "lucide-react";

interface ToolsTabProps {
  data: any;
  onChange: (data: any) => void;
}

export const ToolsTab = ({ data, onChange }: ToolsTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Tools Configuration</h3>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-900 block mb-2">Choose functions</label>
        <select
          value={data.selectedFunction || "none"}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ selectedFunction: e.target.value })}
          className="w-full h-12 bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
        >
          <option value="none">Select functions</option>
          <option value="search">Search</option>
          <option value="calendar">Calendar</option>
          <option value="email">Email</option>
          <option value="crm">CRM</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-all duration-200 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add function
        </button>
      </div>
    </div>
  );
};
