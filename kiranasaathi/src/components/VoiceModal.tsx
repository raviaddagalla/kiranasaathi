import React, { useState, useEffect, useRef } from 'react';
import { parseCustomerVoiceSearch, isSpeechRecognitionAvailable } from '../services/voiceService';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSearch: (query: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onConfirmSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'te-IN'>('en-IN');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const supported = isSpeechRecognitionAvailable();

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setErrorMsg(null);
      return;
    }

    // Auto-start listening if supported
    if (supported) {
      startListening();
    } else {
      setErrorMsg('Speech recognition is not supported in this browser. Please type your query below.');
    }

    return () => {
      stopListening();
    };
  }, [isOpen, language]);

  const startListening = () => {
    setErrorMsg(null);
    setTranscript('');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone permission was denied. Please allow mic access or type below.');
        } else {
          setErrorMsg(`Voice input error: ${event.error}. You can enter text manually.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setErrorMsg('Could not initialize speech recognition. Manual input is available.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleApply = () => {
    const cleaned = parseCustomerVoiceSearch(transcript);
    if (cleaned) {
      onConfirmSearch(cleaned);
      onClose();
    }
  };

  const sampleQueries = [
    'Britannia whole wheat bread',
    'Heritage toned milk',
    'Aashirvaad chakki atta 5kg',
    'Amul butter 100g',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border border-surface-container-high">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">mic</span>
            </div>
            <h3 className="text-base font-bold text-on-surface">Voice Search</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Language selector chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-on-surface-variant font-medium">Language:</span>
          {(
            [
              { id: 'en-IN', label: 'English' },
              { id: 'hi-IN', label: 'हिन्दी' },
              { id: 'te-IN', label: 'తెలుగు' },
            ] as const
          ).map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                language === lang.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Visualizer / Microphone Center Area */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="absolute w-28 h-28 rounded-full bg-secondary-fixed opacity-40 animate-ping"></span>
                <span className="absolute w-24 h-24 rounded-full bg-secondary-fixed opacity-60 animate-pulse"></span>
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                isListening
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-primary text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[36px]">
                {isListening ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold text-on-surface">
            {isListening ? 'Listening... Speak now' : 'Tap mic to start speaking'}
          </p>
          <span className="text-xs text-on-surface-variant mt-0.5">
            e.g. "Find Britannia whole wheat bread"
          </span>
        </div>

        {/* Recognized Transcript or Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Recognized Query (Editable)
          </label>
          <div className="relative">
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Search query will appear here..."
              className="w-full px-4 py-3 bg-surface-container-low border border-surface-container-highest rounded-xl text-sm font-medium text-on-surface focus:outline-none focus:border-primary"
            />
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="absolute right-3 top-3 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Error or Fallback notification */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-error-container text-on-error-container text-xs">
            <span className="material-symbols-outlined text-[18px] flex-shrink-0">warning</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sample queries pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-on-surface-variant font-medium">Or try saying:</span>
          <div className="flex flex-wrap gap-1.5">
            {sampleQueries.map((q) => (
              <button
                key={q}
                onClick={() => setTranscript(q)}
                className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Confirmation buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!transcript.trim()}
            className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Search Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
