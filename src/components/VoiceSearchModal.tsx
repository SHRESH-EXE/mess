import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Search, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResult: (spokenQuery: string) => void;
  lang?: string;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchResult,
  lang = 'en-IN'
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [hasSpeechSupport, setHasSpeechSupport] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
      return;
    }

    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechSupport(false);
      return;
    }

    setHasSpeechSupport(true);
    let recognition: any = null;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultTranscript = event.results[current][0].transcript;
        setTranscript(resultTranscript);
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech start error:', e);
      setIsListening(false);
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isOpen, lang]);

  if (!isOpen) return null;

  const handleApply = (query: string) => {
    if (query.trim()) {
      onSearchResult(query.trim());
      onClose();
    }
  };

  const sampleSuggestions = ['Butter Paneer', 'Masala Dosa', 'Veg Roll', 'Maggie', 'Cold Coffee', 'Biryani', 'Chai'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="my-3 flex justify-center">
          <div className="relative">
            {isListening && (
              <div className="absolute -inset-3 rounded-full bg-amber-500/30 animate-ping pointer-events-none" />
            )}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-slate-950 font-bold shadow-xl transition ${
                isListening
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-500 shadow-amber-500/40 scale-105'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-100">
          {isListening ? 'Listening for dish name...' : transcript ? 'Recognized Voice:' : 'Voice Dish Finder'}
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          {hasSpeechSupport
            ? 'Speak clearly into your microphone to find food court & mess meals'
            : 'Speech recognition not supported on this browser. Select from popular quick picks below:'}
        </p>

        {transcript ? (
          <div className="my-5 p-4 rounded-xl bg-slate-800/80 border border-amber-500/40 text-amber-400 font-bold text-base">
            &ldquo;{transcript}&rdquo;
          </div>
        ) : (
          <div className="my-5 py-3 text-sm text-slate-400 italic">
            Say something like &quot;Masala Dosa&quot; or &quot;Paneer Roll&quot;
          </div>
        )}

        {transcript && (
          <button
            onClick={() => handleApply(transcript)}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 mb-4"
          >
            <Search className="w-4 h-4" />
            Search for &quot;{transcript}&quot;
          </button>
        )}

        <div className="pt-4 border-t border-slate-800 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Campus Favorites
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sampleSuggestions.map((item) => (
              <button
                key={item}
                onClick={() => handleApply(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition border border-slate-700/60"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
