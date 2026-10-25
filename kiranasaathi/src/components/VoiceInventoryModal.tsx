import React, { useState, useEffect, useRef } from 'react';
import type { Product, InventoryEntry } from '../types';
import { parseShopkeeperVoiceCommand, isSpeechRecognitionAvailable } from '../services/voiceService';
import type { ParsedVoiceCommand } from '../services/voiceService';

interface VoiceInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  inventory: InventoryEntry[];
  onApplyStockUpdate: (productId: string, newQuantity: number) => Promise<void>;
  onFilterLowStock?: () => void;
}

export const VoiceInventoryModal: React.FC<VoiceInventoryModalProps> = ({
  isOpen,
  onClose,
  products,
  inventory,
  onApplyStockUpdate,
  onFilterLowStock,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'te-IN'>('en-IN');
  const [parsedCommand, setParsedCommand] = useState<ParsedVoiceCommand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [matchedInventory, setMatchedInventory] = useState<InventoryEntry | null>(null);
  const [adjustedQty, setAdjustedQty] = useState<number>(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const supported = isSpeechRecognitionAvailable();

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      resetState();
      return;
    }

    if (supported) {
      startListening();
    } else {
      setErrorMsg('Speech recognition not available. Please enter the command manually below.');
    }

    return () => {
      stopListening();
    };
  }, [isOpen, language]);

  const resetState = () => {
    setTranscript('');
    setParsedCommand(null);
    setSelectedProduct(null);
    setMatchedInventory(null);
    setAdjustedQty(0);
    setIsConfirming(false);
    setErrorMsg(null);
  };

  const startListening = () => {
    setErrorMsg(null);
    setTranscript('');
    setParsedCommand(null);
    setIsConfirming(false);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

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
        setErrorMsg(`Speech error: ${event.error}. You can type the command below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMsg('Could not initialize speech recognition.');
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

  // Analyze transcript and resolve product
  const handleParseTranscript = (textToParse: string) => {
    setErrorMsg(null);
    const cmd = parseShopkeeperVoiceCommand(textToParse);
    if (!cmd) {
      setErrorMsg('Could not understand voice command. Please try again.');
      return;
    }

    setParsedCommand(cmd);

    // If command is to show low stock
    if (cmd.action === 'show') {
      if (onFilterLowStock) {
        onFilterLowStock();
        onClose();
        return;
      }
    }

    // Try matching product in catalog
    const query = cmd.productQuery.toLowerCase().trim();
    const matched = products.find((p) => {
      const pName = p.name.toLowerCase();
      const pBrand = p.brand.toLowerCase();
      const pAliases = p.aliases.map((a) => a.toLowerCase());
      return (
        pName.includes(query) ||
        pBrand.includes(query) ||
        pAliases.some((a) => a.includes(query)) ||
        query.includes(pBrand) ||
        query.includes(pName)
      );
    });

    if (!matched) {
      setErrorMsg(`Could not find product matching "${cmd.productQuery}". Please select from catalog or rephrase.`);
      return;
    }

    setSelectedProduct(matched);
    const inv = inventory.find((i) => i.productId === matched.id) || null;
    setMatchedInventory(inv);

    const currentQty = inv ? inv.quantity : 0;
    let targetQty = currentQty;

    if (cmd.action === 'set') {
      targetQty = cmd.quantity ?? 0;
    } else if (cmd.action === 'add') {
      targetQty = currentQty + (cmd.quantity ?? 0);
    } else if (cmd.action === 'reduce') {
      targetQty = Math.max(0, currentQty - (cmd.quantity ?? 0));
    }

    setAdjustedQty(targetQty);
    setIsConfirming(true);
  };

  const handleConfirmSave = async () => {
    if (!selectedProduct) return;
    setIsSaving(true);
    try {
      await onApplyStockUpdate(selectedProduct.id, adjustedQty);
      setIsSaving(false);
      onClose();
    } catch {
      setIsSaving(false);
      setErrorMsg('Failed to persist inventory change. Please try again.');
    }
  };

  const sampleVoiceCommands = [
    'Set Parle-G stock to 20 packets',
    'Add 10 packets of Amul milk',
    'I sold 5 packets of Britannia bread',
    'Set Tata Salt stock to zero',
    'Show low-stock products',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-4 border border-surface-container-high max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">Voice Stock Assistant</h3>
              <p className="text-xs text-on-surface-variant">Update inventory with spoken commands</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Confirmation State */}
        {isConfirming && selectedProduct ? (
          <div className="flex flex-col gap-4 py-2">
            <div className="p-4 rounded-2xl bg-primary-fixed/30 border border-primary-fixed flex flex-col gap-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">task_alt</span>
                <span>Confirm Inventory Adjustment</span>
              </div>

              <div className="flex items-center gap-3 bg-surface-container-lowest p-3 rounded-xl shadow-xs">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-14 h-14 object-cover rounded-lg bg-surface-container"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-on-surface truncate">{selectedProduct.name}</h4>
                  <p className="text-xs text-on-surface-variant">
                    {selectedProduct.brand} • {selectedProduct.packageSize}
                  </p>
                  <p className="text-xs text-primary font-semibold mt-0.5">
                    Current Stock: {matchedInventory ? matchedInventory.quantity : 0} units
                  </p>
                </div>
              </div>

              {/* Action Summary Pill */}
              <div className="bg-surface-container-low p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-on-surface-variant block uppercase font-bold tracking-wider">
                    Target Action
                  </span>
                  <span className="text-sm font-bold text-on-surface">
                    {parsedCommand?.action === 'set' && `Set stock to ${adjustedQty} units`}
                    {parsedCommand?.action === 'add' && `Add ${parsedCommand.quantity} units (New total: ${adjustedQty})`}
                    {parsedCommand?.action === 'reduce' && `Sold ${parsedCommand.quantity} units (Remaining: ${adjustedQty})`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant block uppercase font-bold tracking-wider">
                    New Quantity
                  </span>
                  <span className="text-lg font-black text-primary">{adjustedQty}</span>
                </div>
              </div>

              {/* Edit Quantity Stepper if needed */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-on-surface-variant font-medium">Adjust before saving:</span>
                <div className="flex items-center gap-2 bg-surface-container-high px-2 py-1 rounded-full">
                  <button
                    onClick={() => setAdjustedQty(Math.max(0, adjustedQty - 1))}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary active:scale-90"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{adjustedQty}</span>
                  <button
                    onClick={() => setAdjustedQty(adjustedQty + 1)}
                    className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsConfirming(false)}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high"
              >
                Back / Edit
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isSaving}
                className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>{isSaving ? 'Updating...' : 'Confirm & Save'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Listening / Input State */
          <div className="flex flex-col gap-4">
            {/* Language chips */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-on-surface-variant font-medium">Voice Language:</span>
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

            {/* Mic Center Button */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                {isListening && (
                  <>
                    <span className="absolute w-24 h-24 rounded-full bg-primary-fixed opacity-40 animate-ping"></span>
                    <span className="absolute w-20 h-20 rounded-full bg-primary-fixed opacity-60 animate-pulse"></span>
                  </>
                )}
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                    isListening
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-primary text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[30px]">
                    {isListening ? 'graphic_eq' : 'mic'}
                  </span>
                </button>
              </div>
              <p className="mt-2 text-xs font-bold text-on-surface">
                {isListening ? 'Listening to stock command...' : 'Tap mic to dictate command'}
              </p>
            </div>

            {/* Command Text input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Recognized Command (Or Type Manually)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="e.g. Set Parle-G stock to 20 packets"
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

            {errorMsg && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] flex-shrink-0">info</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Sample commands */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-on-surface-variant font-medium">Try speaking one of these:</span>
              <div className="flex flex-wrap gap-1.5">
                {sampleVoiceCommands.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => {
                      setTranscript(cmd);
                      handleParseTranscript(cmd);
                    }}
                    className="px-2.5 py-1 rounded-full bg-surface-container text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high"
              >
                Cancel
              </button>
              <button
                onClick={() => handleParseTranscript(transcript)}
                disabled={!transcript.trim()}
                className="flex-1 h-12 rounded-xl bg-primary text-on-primary text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                <span>Process Command</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
