import React from "react";
import GradientSlider from "./GradientSlider";

interface EngineTabProps {
  data: any;
  onChange: (data: any) => void;
}

export const EngineTab = ({ data, onChange }: EngineTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Agent Engine Configuration</h3>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Transcription & instructions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block">Generate precise transcript</label>
              <p className="text-xs text-gray-600 mt-1">
                Agent will try to generate more precise transcripts during interruptions
              </p>
              <button className="text-xs text-[#4F46E5] hover:underline mt-1 inline-block">
                Learn more
              </button>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={data.generatePreciseTranscript || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ generatePreciseTranscript: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4F46E5] 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                            after:rounded-full after:h-6 after:w-6 after:transition-all 
                            peer-checked:bg-[#4F46E5]"></div>
            </label>
          </div>

          {/* Number of words to wait - SECOND FIELD */}
          <div>
            <GradientSlider
              label="Number of words to wait for before interrupting"
              value={data.interruptionThreshold ?? 5}
              onChange={(value: number) => onChange({ interruptionThreshold: value })}
              min={0}
              max={10}
              step={1}
              description="Agent will not consider interruptions until these many words are spoken by response keys 'disposition', such as 'Sure. Wait. That's all.' I'm done. Note: Verbal Det, agent will pause by default!"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Voice Response Rate Configuration</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="response-rate" className="text-sm font-semibold text-gray-900 block mb-2">Response Rate</label>
            <select
              id="response-rate"
              value={data.responseRate || "rapid"}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ responseRate: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] mt-1.5"
            >
              <option value="rapid">Rapid</option>
              <option value="normal">Normal</option>
              <option value="patient">Patient</option>
              <option value="custom">Custom</option>
            </select>
            <p className="text-xs text-gray-600 mt-1.5">
              Agent will try to answer with minimum latency, often interrupting humans if they are speaking with pauses
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">User Online Detection</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block">Check if user is online</label>
              <p className="text-xs text-gray-600 mt-1">
                Agent will check if the user is online if there's no reply from the user
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={data.userOnlineCheck !== false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ userOnlineCheck: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4F46E5] 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                            after:rounded-full after:h-6 after:w-6 after:transition-all 
                            peer-checked:bg-[#4F46E5]"></div>
            </label>
          </div>

          {/* Only show these fields when user online check is enabled */}
          {data.userOnlineCheck !== false && (
            <>
              <div>
                <label htmlFor="online-message" className="text-sm font-semibold text-gray-900 block mb-2">User is online message</label>
                <textarea
                  id="online-message"
                  placeholder="Hey, are you still there"
                  value={data.onlineMessage || ""}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ onlineMessage: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-none mt-1.5"
                  rows={2}
                />
              </div>

              <div>
                <GradientSlider
                  label="Invoke message after (seconds)"
                  value={data.invokeAfter ?? 10}
                  onChange={(value: number) => onChange({ invokeAfter: value })}
                  min={5}
                  max={20}
                  step={1}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
