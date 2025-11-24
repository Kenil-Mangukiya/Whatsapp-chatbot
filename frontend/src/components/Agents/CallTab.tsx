import React from "react";
import GradientSlider from "./GradientSlider";

interface CallTabProps {
  data: any;
  onChange: (data: any) => void;
}

export const CallTab = ({ data, onChange }: CallTabProps) => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Call Configuration</h3>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Telephony Provider</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="telephony-provider" className="text-sm font-semibold text-gray-900 block mb-2">Provider</label>
            <select
              id="telephony-provider"
              value={data.telephonyProvider || "plivo"}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange({ telephonyProvider: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] mt-1.5"
            >
              <option value="plivo">Plivo</option>
              <option value="twilio">Twilio</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Voicemail detection</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block">Automatically disconnect call on voicemail detection</label>
              <p className="text-xs text-gray-600 mt-1">
                Time allotted to analyze if the call has been answered by a machine. The default value is 2500 ms.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={data.voicemailDetection || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ voicemailDetection: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4F46E5] 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                            after:rounded-full after:h-6 after:w-6 after:transition-all 
                            peer-checked:bg-[#4F46E5]"></div>
            </label>
          </div>

          {/* Only show time field when voicemail detection is enabled */}
          {data.voicemailDetection && (
            <div>
              <GradientSlider
                label="Time (seconds)"
                value={data.voicemailTime ?? 2.5}
                onChange={(value: number) => onChange({ voicemailTime: value })}
                min={2}
                max={10}
                step={0.5}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Call hangup modes</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block">Hangup calls on user silence</label>
              <p className="text-xs text-gray-600 mt-1">
                Call will hangup if the user is not speaking
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={data.hangupOnSilence || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ hangupOnSilence: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4F46E5] 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                            after:rounded-full after:h-6 after:w-6 after:transition-all 
                            peer-checked:bg-[#4F46E5]"></div>
            </label>
          </div>

          {/* Only show time field when hangup on silence is enabled */}
          {data.hangupOnSilence && (
            <div>
              <GradientSlider
                label="Time (seconds)"
                value={data.hangupTime ?? 10}
                onChange={(value: number) => onChange({ hangupTime: value })}
                min={5}
                max={60}
                step={5}
              />
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-900 block">Hangup calls using a prompt</label>
              <p className="text-xs text-gray-600 mt-1">
                Call will hangup as per the prompted prompt
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={data.hangupOnPrompt || false}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ hangupOnPrompt: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#4F46E5] 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white 
                            after:rounded-full after:h-6 after:w-6 after:transition-all 
                            peer-checked:bg-[#4F46E5]"></div>
            </label>
          </div>

          {/* Only show prompt field when hangup on prompt is enabled */}
          {data.hangupOnPrompt && (
            <div>
              <label htmlFor="hangup-prompt" className="text-sm font-semibold text-gray-900 block mb-2">Prompt</label>
              <textarea
                id="hangup-prompt"
                placeholder="You are an AI assistant determining if a conversation is complete..."
                value={data.hangupPrompt || ""}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ hangupPrompt: e.target.value })}
                className="w-full min-h-[100px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y mt-1.5"
              />
            </div>
          )}

          {/* Call hangup message field */}
          <div className="mt-4">
            <label htmlFor="call-hangup-message" className="text-sm font-semibold text-gray-900 block mb-2">Call hangup message</label>
            <textarea
              id="call-hangup-message"
              placeholder="Call will disconnect now"
              value={data.callHangupMessage || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ callHangupMessage: e.target.value })}
              className="w-full min-h-[80px] bg-white border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] placeholder:text-gray-400 resize-y mt-1.5"
            />
            <p className="text-xs text-gray-600 mt-1.5">
              Provide the final agent message just before hanging up.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Call Termination</h3>
        <div className="space-y-4">
          <div>
            <GradientSlider
              label="Time (seconds)"
              value={data.callDuration ?? 300}
              onChange={(value: number) => onChange({ callDuration: value })}
              min={30}
              max={2400}
              step={5}
              description={`The call ends after ${data.callDuration ?? 300} seconds of call time`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
