import React, { useState, useEffect, useRef } from 'react';
import { getAllVoices, getMyVoices, addVoice, removeVoice, generateTTSPreview, type BolnaVoice } from '../services/apis/agentVoiceAPI';
import { User, Users, Play, Pause, Volume2 } from 'lucide-react';

interface VoiceLabPageProps {
  isActive: boolean;
}

const VoiceLabPage: React.FC<VoiceLabPageProps> = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState<'my-voices' | 'all-voices'>('my-voices');
  const [allVoices, setAllVoices] = useState<BolnaVoice[]>([]);
  const [myVoices, setMyVoices] = useState<BolnaVoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Audio playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [textInputs, setTextInputs] = useState<{ [key: string]: string }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentVoices = activeTab === 'my-voices' ? myVoices : allVoices;

  useEffect(() => {
    if (isActive) {
      fetchMyVoices();
      fetchAllVoices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Initialize text inputs when voices are loaded
  useEffect(() => {
    if (currentVoices.length > 0) {
      const initialInputs: { [key: string]: string } = {};
      currentVoices.forEach((voice) => {
        if (!textInputs[voice.id]) {
          initialInputs[voice.id] = `This is the text you can play using ${voice.name}`;
        }
      });
      setTextInputs({ ...textInputs, ...initialInputs });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVoices.length]);

  const fetchAllVoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVoices();
      setAllVoices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch voices');
      console.error('Error fetching voices:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyVoices = async () => {
    try {
      const data = await getMyVoices();
      setMyVoices(data);
    } catch (err: any) {
      console.error('Error fetching my voices:', err);
    }
  };

  const handleAddVoice = async (voice: BolnaVoice) => {
    if (!voice.agentVoiceId) return;
    
    try {
      await addVoice(voice.agentVoiceId);
      await fetchMyVoices(); // Refresh my voices
    } catch (err: any) {
      console.error('Error adding voice:', err);
    }
  };

  const handleRemoveVoice = async (voice: BolnaVoice) => {
    if (!voice.agentVoiceId) return;
    
    try {
      await removeVoice(voice.agentVoiceId);
      await fetchMyVoices(); // Refresh my voices
    } catch (err: any) {
      console.error('Error removing voice:', err);
    }
  };

  // Helper function to check if a voice is in my voices
  const isVoiceInMyVoices = (voiceId: string): boolean => {
    return myVoices.some((v) => v.id === voiceId);
  };

  // Helper function to build provider_config based on provider
  const buildProviderConfig = (voice: BolnaVoice): any => {
    switch (voice.provider.toLowerCase()) {
      case 'polly':
        // Polly uses: voice, language, engine
        return {
          voice: voice.name,
          language: voice.language_code || 'en-US',
          engine: voice.model || 'neural'
        };
      case 'azuretts':
        // Azure uses: voice_id as the identifier
        return {
          voice_id: voice.voice_id
        };
      case 'google':
        // Google uses: voice_id
        return {
          voice_id: voice.voice_id
        };
      case 'deepgram':
        // Deepgram uses: voice_id
        return {
          voice_id: voice.voice_id
        };
      case 'elevenlabs':
        // ElevenLabs uses: model, voice_id
        return {
          model: voice.model,
          voice_id: voice.voice_id
        };
      case 'rime':
        // Rime uses: model, voice_id
        return {
          model: voice.model,
          voice_id: voice.voice_id
        };
      case 'inworld':
        // Inworld uses: voice (name)
        return {
          voice: voice.name
        };
      case 'sarvam':
        // Sarvam uses: voice_id
        return {
          voice_id: voice.voice_id
        };
      case 'smallest':
        // Smallest uses: voice_id
        return {
          voice_id: voice.voice_id
        };
      default:
        // Default: send all available fields
        return {
          model: voice.model,
          voice: voice.name,
          voice_id: voice.voice_id
        };
    }
  };

  // Handle audio playback
  const handlePlayPause = async (voice: BolnaVoice) => {
    const text = textInputs[voice.id] || '';
    
    // Validation
    if (!text.trim()) {
      setValidationErrors({ ...validationErrors, [voice.id]: 'Enter the text' });
      return;
    }
    
    // Clear validation error
    if (validationErrors[voice.id]) {
      const newErrors = { ...validationErrors };
      delete newErrors[voice.id];
      setValidationErrors(newErrors);
    }
    
    // Toggle playback
    if (playingVoiceId === voice.id) {
      // Pause audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingVoiceId(null);
    } else {
      // Stop currently playing audio if any
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Play new audio
      try {
        setPlayingVoiceId(voice.id);
        
        // Generate audio preview
        const audioBlobString = await generateTTSPreview(
          voice.id,
          text
        );
        
        // Create audio URL and play
        // Convert string to Blob for URL.createObjectURL
        const audioUrl = URL.createObjectURL(new Blob([audioBlobString]));
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        // Handle audio end
        audio.onended = () => {
          setPlayingVoiceId(null);
          audioRef.current = null;
          URL.revokeObjectURL(audioUrl);
        };
        
        // Handle audio error
        audio.onerror = () => {
          setPlayingVoiceId(null);
          audioRef.current = null;
          URL.revokeObjectURL(audioUrl);
          console.error('Error playing audio');
        };
        
        await audio.play();
      } catch (err: any) {
        console.error('Error generating audio preview:', err);
        setPlayingVoiceId(null);
      }
    }
  };

  // Handle text input change
  const handleTextChange = (voiceId: string, value: string) => {
    setTextInputs({ ...textInputs, [voiceId]: value });
    
    // Clear validation error when user starts typing
    if (validationErrors[voiceId]) {
      const newErrors = { ...validationErrors };
      delete newErrors[voiceId];
      setValidationErrors(newErrors);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isActive ? 'block' : 'hidden'}`}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Lab</h1>
          <p className="text-gray-600">Explore and test voices</p>
        </div>

        {/* Enhanced Tabs with beautiful transitions */}
        <div className="mb-8">
          <div className="relative bg-white rounded-lg p-2 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('my-voices')}
                className={`relative flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-md transition-all duration-300 ease-in-out z-10 ${
                  activeTab === 'my-voices'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-5 h-5" />
                My Voices
              </button>
              <button
                onClick={() => setActiveTab('all-voices')}
                className={`relative flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-md transition-all duration-300 ease-in-out z-10 ${
                  activeTab === 'all-voices'
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5" />
                All Voices
              </button>
              {/* Animated background slider */}
              <div
                className={`absolute top-2 bottom-2 rounded-md bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 transition-all duration-300 ease-in-out shadow-lg ${
                  activeTab === 'my-voices' ? 'left-2 w-36' : 'left-40 w-36'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F46E5]"></div>
          </div>
        )}

        {/* Enhanced Voices Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVoices.map((voice) => {
              const isAdded = isVoiceInMyVoices(voice.id);
              const isPlaying = playingVoiceId === voice.id;
              const text = textInputs[voice.id] || '';
              const hasError = validationErrors[voice.id];
              
              return (
                <div
                  key={voice.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
                  
                  <div className="flex items-start justify-between mb-4 mt-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {voice.name}
                      </h3>
                      {voice.accent && (
                        <p className="text-sm text-gray-500 mb-2">{voice.accent}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-bold rounded-full whitespace-nowrap border border-purple-200">
                      {voice.provider}
                    </span>
                  </div>
                  
                  {/* Audio Preview Section */}
                  <div className="mb-4 space-y-2">
                    <div className="relative flex items-center gap-2">
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(voice.id, e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
                          hasError
                            ? 'border-red-300 bg-red-50 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-purple-500'
                        }`}
                        placeholder="Enter text to preview"
                      />
                      <button
                        onClick={() => handlePlayPause(voice)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                          isPlaying
                            ? 'bg-red-500 text-white animate-pulse hover:bg-red-600'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                    </div>
                    {hasError && (
                      <p className="text-xs text-red-600 flex items-center gap-1 animate-fade-in">
                        <Volume2 className="w-3 h-3" />
                        {hasError}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => isAdded ? handleRemoveVoice(voice) : handleAddVoice(voice)}
                    className={`w-full px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      isAdded
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105'
                    }`}
                  >
                    {isAdded ? 'Remove' : 'Add Voice'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && currentVoices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {activeTab === 'my-voices'
                ? 'No voices added yet. Go to "All Voices" to add some!'
                : 'No voices available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceLabPage;

