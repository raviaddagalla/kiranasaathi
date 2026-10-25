// ==========================================
// Voice Input & Command Parsing Service
// ==========================================

export interface SpeechRecognitionHookState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  language: string;
}

// Map English number words to digits
const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  fifteen: 15,
  twenty: 20,
  twentyfive: 25,
  thirty: 30,
  forty: 40,
  fifty: 50,
  hundred: 100,
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  paanch: 5,
  che: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  dus: 10,
  okati: 1,
  rendu: 2,
  moodu: 3,
  naalugu: 4,
  aidu: 5,
  aaru: 6,
  yedu: 7,
  enimidi: 8,
  tommidi: 9,
  padi: 10,
};

function parseNumber(str: string): number | null {
  const cleanStr = str.trim().toLowerCase();
  const directNum = parseInt(cleanStr, 10);
  if (!isNaN(directNum)) return directNum;
  if (NUMBER_WORDS[cleanStr] !== undefined) return NUMBER_WORDS[cleanStr];
  return null;
}

export interface ParsedVoiceCommand {
  action: 'set' | 'add' | 'reduce' | 'show';
  productQuery: string;
  quantity?: number;
  unit?: string;
  rawTranscript: string;
  confidence: 'high' | 'medium' | 'low';
  clarificationPrompt?: string;
}

export function parseShopkeeperVoiceCommand(transcript: string): ParsedVoiceCommand | null {
  const text = transcript.trim().toLowerCase();

  // Show low stock pattern
  if (
    text.includes('show low') ||
    text.includes('low stock') ||
    text.includes('kam stock') ||
    text.includes('takkuva stock')
  ) {
    return {
      action: 'show',
      productQuery: '',
      rawTranscript: transcript,
      confidence: 'high',
    };
  }

  // Common units
  const units = ['packets', 'packet', 'packs', 'pack', 'bottles', 'bottle', 'pouches', 'pouch', 'kg', 'kgs', 'g', 'grams', 'units', 'boxes', 'box', 'dabba', 'dabbas', 'dost'];
  const unitRegexPart = units.join('|');

  // Pattern 1: "Set [Product] stock to [Quantity] [Unit?]"
  // e.g. "set Parle-G stock to 20 packets", "set tata salt stock to zero"
  const setRegex = new RegExp(
    `(?:set|rakho|bana do)\\s+(?:the\\s+)?(.+?)\\s+(?:stock\\s+)?(?:to|ko|pe)\\s+(\\w+)(?:\\s+(${unitRegexPart}))?`,
    'i'
  );
  const setMatch = text.match(setRegex);
  if (setMatch) {
    const productQuery = setMatch[1].trim();
    const qtyStr = setMatch[2].trim();
    const unit = setMatch[3]?.trim() || 'packets';
    const quantity = parseNumber(qtyStr);

    if (quantity !== null) {
      return {
        action: 'set',
        productQuery,
        quantity,
        unit,
        rawTranscript: transcript,
        confidence: 'high',
      };
    }
  }

  // Pattern 2: "Add [Quantity] [Unit?] of [Product]" or "Add [Product] [Quantity] [Unit?]"
  // e.g. "add 10 bottles of Amul milk", "add 5 packets parle g"
  const addRegex1 = new RegExp(
    `(?:add|badao|jodo|ekkuva chey)\\s+(\\w+)(?:\\s+(${unitRegexPart}))?(?:\\s+of)?\\s+(.+)`,
    'i'
  );
  const addMatch1 = text.match(addRegex1);
  if (addMatch1) {
    const qtyStr = addMatch1[1].trim();
    const unit = addMatch1[2]?.trim() || 'units';
    const productQuery = addMatch1[3].trim();
    const quantity = parseNumber(qtyStr);

    if (quantity !== null) {
      return {
        action: 'add',
        productQuery,
        quantity,
        unit,
        rawTranscript: transcript,
        confidence: 'high',
      };
    }
  }

  // Pattern 3: "I sold [Quantity] [Unit?] of [Product]" or "Reduce [Product] by [Quantity]"
  // e.g. "i sold five packets of britannia bread", "sold 3 milk", "reduce amul butter by 2"
  const reduceRegex1 = new RegExp(
    `(?:i\\s+sold|sold|becha|bech diya|ammina)\\s+(\\w+)(?:\\s+(${unitRegexPart}))?(?:\\s+of)?\\s+(.+)`,
    'i'
  );
  const reduceMatch1 = text.match(reduceRegex1);
  if (reduceMatch1) {
    const qtyStr = reduceMatch1[1].trim();
    const unit = reduceMatch1[2]?.trim() || 'units';
    const productQuery = reduceMatch1[3].trim();
    const quantity = parseNumber(qtyStr);

    if (quantity !== null) {
      return {
        action: 'reduce',
        productQuery,
        quantity,
        unit,
        rawTranscript: transcript,
        confidence: 'high',
      };
    }
  }

  const reduceRegex2 = new RegExp(
    `(?:reduce|ghatao|kam karo|tagginchu)\\s+(.+?)\\s+by\\s+(\\w+)(?:\\s+(${unitRegexPart}))?`,
    'i'
  );
  const reduceMatch2 = text.match(reduceRegex2);
  if (reduceMatch2) {
    const productQuery = reduceMatch2[1].trim();
    const qtyStr = reduceMatch2[2].trim();
    const unit = reduceMatch2[3]?.trim() || 'units';
    const quantity = parseNumber(qtyStr);

    if (quantity !== null) {
      return {
        action: 'reduce',
        productQuery,
        quantity,
        unit,
        rawTranscript: transcript,
        confidence: 'high',
      };
    }
  }

  // Fallback: If transcript contains numbers and words, try best-effort extraction
  const tokens = text.split(/\s+/);
  let foundNum: number | null = null;
  let numIndex = -1;

  for (let i = 0; i < tokens.length; i++) {
    const n = parseNumber(tokens[i]);
    if (n !== null) {
      foundNum = n;
      numIndex = i;
      break;
    }
  }

  if (foundNum !== null && numIndex >= 0) {
    const nonNumberTokens = tokens.filter((_, idx) => idx !== numIndex && !['packet', 'packets', 'bottles', 'bottle', 'stock', 'to', 'of', 'by', 'add', 'set', 'sold'].includes(tokens[idx]));
    const fallbackProduct = nonNumberTokens.join(' ');
    let action: 'set' | 'add' | 'reduce' = 'set';
    if (text.includes('sold') || text.includes('reduce') || text.includes('becha')) action = 'reduce';
    else if (text.includes('add') || text.includes('jodo') || text.includes('badao')) action = 'add';

    return {
      action,
      productQuery: fallbackProduct,
      quantity: foundNum,
      unit: 'packets',
      rawTranscript: transcript,
      confidence: 'medium',
    };
  }

  // Low confidence / needs clarification
  return {
    action: 'set',
    productQuery: text,
    rawTranscript: transcript,
    confidence: 'low',
    clarificationPrompt: `Could not understand quantity for "${transcript}". Try saying: "Set Parle-G stock to 20 packets" or "Sold 3 Britannia bread".`,
  };
}

export function parseCustomerVoiceSearch(transcript: string): string {
  let cleaned = transcript.trim();
  // Strip common filler prefixes
  cleaned = cleaned.replace(/^(find|search for|look for|where is|do you have|mujhe chahiye|kahan milega)\s+/i, '');
  cleaned = cleaned.replace(/\s+(chahiye|hai kya|undi|kavali)$/i, '');
  return cleaned.trim();
}

export function isSpeechRecognitionAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}
