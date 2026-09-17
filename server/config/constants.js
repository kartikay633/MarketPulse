// ROADMAP: Section 6 — Backend Architecture (Constants)

export const MARKET_TIMEZONE = 'Asia/Kolkata';

// NSE/BSE market hours in minutes from midnight IST
export const MARKET_HOURS = {
  PRE_MARKET_START: 540,   // 09:00
  MARKET_OPEN: 555,        // 09:15
  MARKET_CLOSE: 930,       // 15:30
  POST_MARKET_END: 940,    // 15:40
};

// Major index instrument keys for Upstox
export const INDEX_KEYS = {
  NIFTY_50: 'NSE_INDEX|Nifty 50',
  SENSEX: 'BSE_INDEX|SENSEX',
  BANK_NIFTY: 'NSE_INDEX|Nifty Bank',
  INDIA_VIX: 'NSE_INDEX|India VIX',
  NIFTY_IT: 'NSE_INDEX|Nifty IT',
  NIFTY_PHARMA: 'NSE_INDEX|Nifty Pharma',
  NIFTY_AUTO: 'NSE_INDEX|Nifty Auto',
  NIFTY_FMCG: 'NSE_INDEX|Nifty FMCG',
  NIFTY_METAL: 'NSE_INDEX|Nifty Metal',
  NIFTY_REALTY: 'NSE_INDEX|Nifty Realty',
  NIFTY_ENERGY: 'NSE_INDEX|Nifty Energy',
  NIFTY_INFRA: 'NSE_INDEX|Nifty Infra',
  NIFTY_FIN_SERVICE: 'NSE_INDEX|Nifty Fin Service',
  NIFTY_MEDIA: 'NSE_INDEX|Nifty Media',
};

// Cache TTLs (in seconds)
export const CACHE_TTL = {
  MARKET_QUOTE: 15,            // 15 seconds during market hours
  MARKET_QUOTE_CLOSED: 300,    // 5 minutes when market closed
  HISTORICAL_INTRADAY: 3600,   // 1 hour
  HISTORICAL_DAILY: 86400,     // 24 hours
  SEARCH_RESULTS: 600,         // 10 minutes
  NEWS_GENERAL: 300,           // 5 minutes
  NEWS_STOCK: 600,             // 10 minutes
  AI_MARKET_SUMMARY: 1800,    // 30 minutes
  AI_STOCK_INSIGHT: 900,       // 15 minutes
  INSTRUMENTS: 86400,          // 24 hours
};

// Rate limits
export const RATE_LIMITS = {
  GENERAL: { windowMs: 60000, max: 100 },       // 100 req/min
  AI_CHAT: { windowMs: 3600000, max: 20 },      // 20 req/hour
  AI_SUMMARY: { windowMs: 60000, max: 20 },     // 20 req/min
  TRADE: { windowMs: 60000, max: 10 },          // 10 req/min
  SEARCH: { windowMs: 60000, max: 60 },         // 60 req/min
};

// Paper trading defaults
export const PAPER_TRADING = {
  INITIAL_BALANCE: 1000000.00,  // ₹10,00,000
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 10000,
  MAX_POSITIONS: 50,
};

// Upstox API
export const UPSTOX = {
  BASE_URL: process.env.UPSTOX_API_BASE_URL || 'https://api.upstox.com/v2',
  MAX_INSTRUMENTS_PER_REQUEST: 500,
};
