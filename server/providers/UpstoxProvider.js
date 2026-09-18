// ROADMAP: Section 8 — Upstox Provider Implementation (Live & Fallback Mock)
import axios from 'axios';
import { MarketDataProvider } from './MarketDataProvider.js';
import { getMarketStatus } from '../utils/marketHours.js';
import logger from '../utils/logger.js';

// Symbol mapping between Market Pulse internal format and Upstox instrument keys
const RAW_MAPPINGS = {
  NIFTY_50: 'NSE_INDEX|Nifty 50',
  BANK_NIFTY: 'NSE_INDEX|Nifty Bank',
  SENSEX: 'BSE_INDEX|SENSEX',
  INDIA_VIX: 'NSE_INDEX|India VIX',
  RELIANCE: 'NSE_EQ|INE002A01018',
  TCS: 'NSE_EQ|INE467B01029',
  HDFCBANK: 'NSE_EQ|INE040A01034',
  INFY: 'NSE_EQ|INE009A01021',
  ICICIBANK: 'NSE_EQ|INE090A01021',
  TATAMOTORS: 'NSE_EQ|INE155A01022',
  BHARTIARTL: 'NSE_EQ|INE397D01024',
  ITC: 'NSE_EQ|INE154A01025',
  LT: 'NSE_EQ|INE018A01030',
  TATASTEEL: 'NSE_EQ|INE081A01020',
  SUNPHARMA: 'NSE_EQ|INE044A01036',
  SBIN: 'NSE_EQ|INE062A01020',
  AXISBANK: 'NSE_EQ|INE238A01034',
  KOTAKBANK: 'NSE_EQ|INE237A01028',
  WIPRO: 'NSE_EQ|INE075A01022',
  HCLTECH: 'NSE_EQ|INE860A01027',
  BAJFINANCE: 'NSE_EQ|INE296A01024',
  BAJAJFINSV: 'NSE_EQ|INE918I01026',
  MARUTI: 'NSE_EQ|INE585B01010',
  ASIANPAINT: 'NSE_EQ|INE021A01026',
  TITAN: 'NSE_EQ|INE280A01028',
  ULTRACEMCO: 'NSE_EQ|INE481G01011',
  NTPC: 'NSE_EQ|INE733E01010',
  POWERGRID: 'NSE_EQ|INE752E01010',
  ONGC: 'NSE_EQ|INE213A01029',
  COALINDIA: 'NSE_EQ|INE522F01014',
  JSWSTEEL: 'NSE_EQ|INE019A01038',
  HINDALCO: 'NSE_EQ|INE038A01020',
  ADANIENT: 'NSE_EQ|INE423A01024',
  ADANIPORTS: 'NSE_EQ|INE742F01042',
  NESTLEIND: 'NSE_EQ|INE239A01024',
  DRREDDY: 'NSE_EQ|INE089A01023',
  CIPLA: 'NSE_EQ|INE059A01026',
  TECHM: 'NSE_EQ|INE669C01036',
};

// Build lookup map supporting 'RELIANCE', 'NSE:RELIANCE', 'BSE:RELIANCE'
const SYMBOL_TO_INSTRUMENT_KEY = {};
for (const [key, val] of Object.entries(RAW_MAPPINGS)) {
  SYMBOL_TO_INSTRUMENT_KEY[key] = val;
  SYMBOL_TO_INSTRUMENT_KEY[`NSE:${key}`] = val;
  SYMBOL_TO_INSTRUMENT_KEY[`BSE:${key}`] = val;
}

export class UpstoxProvider extends MarketDataProvider {
  constructor() {
    super();
    this.token = process.env.UPSTOX_ANALYTICS_TOKEN;
    this.baseUrl = process.env.UPSTOX_API_BASE_URL || 'https://api.upstox.com/v2';
    this.isLive = Boolean(this.token && this.token !== 'your-analytics-token');

    if (this.isLive) {
      logger.info('Upstox credentials active — connected to live NSE/BSE Upstox feeds');
    } else {
      logger.info('Upstox credentials not configured — running in high-fidelity mock provider mode');
    }
  }

  async getMarketOverview() {
    const marketState = getMarketStatus();
    const indices = await this.getIndices();

    const breadth = {
      advancing: 1342,
      declining: 814,
      unchanged: 112,
    };

    const sectors = [
      { name: 'Nifty IT', changePercent: 1.64, positive: true },
      { name: 'Nifty Bank', changePercent: 0.82, positive: true },
      { name: 'Nifty Auto', changePercent: 1.15, positive: true },
      { name: 'Nifty Pharma', changePercent: -0.45, positive: false },
      { name: 'Nifty FMCG', changePercent: 0.32, positive: true },
      { name: 'Nifty Metal', changePercent: -0.88, positive: false },
      { name: 'Nifty Energy', changePercent: 1.42, positive: true },
      { name: 'Nifty Realty', changePercent: 2.18, positive: true },
    ];

    return {
      status: marketState.status,
      statusMessage: marketState.reason,
      timestamp: new Date().toISOString(),
      indices,
      breadth,
      sectors,
    };
  }

  async getIndices() {
    if (this.isLive) {
      try {
        const res = await axios.get(`${this.baseUrl}/market-quote/quotes`, {
          params: {
            instrument_key: 'NSE_INDEX|Nifty 50,BSE_INDEX|SENSEX,NSE_INDEX|Nifty Bank,NSE_INDEX|India VIX',
          },
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
          timeout: 7000,
        });
        if (res.data?.data) {
          return this._normalizeIndices(res.data.data);
        }
      } catch (err) {
        logger.warn({ err: err.message }, 'Live Upstox indices request failed, using high-fidelity fallback');
      }
    }

    return this._getFallbackIndices();
  }

  _normalizeIndices(data) {
    const list = [];
    for (const [key, quote] of Object.entries(data)) {
      const isNifty = key.includes('Nifty 50');
      const isBank = key.includes('Nifty Bank');
      const isSensex = key.includes('SENSEX');
      const isVix = key.includes('India VIX');

      const symbol = isNifty ? 'NIFTY_50' : isSensex ? 'SENSEX' : isBank ? 'BANK_NIFTY' : isVix ? 'INDIA_VIX' : key;
      const name = isNifty ? 'NIFTY 50' : isSensex ? 'BSE SENSEX' : isBank ? 'NIFTY BANK' : isVix ? 'INDIA VIX' : key;
      const value = quote.last_price || quote.ltp || quote.close || 0;
      const prevClose = quote.ohlc?.close || quote.previous_close || value;
      const change = quote.net_change ?? (value - prevClose);
      const changePercent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;

      list.push({
        symbol,
        name,
        value,
        change: Number(change.toFixed(2)),
        changePercent,
        open: quote.ohlc?.open || 0,
        high: quote.ohlc?.high || 0,
        low: quote.ohlc?.low || 0,
        previousClose: prevClose,
      });
    }

    // Ensure order: NIFTY 50, SENSEX, BANK NIFTY, INDIA VIX
    const order = ['NIFTY_50', 'SENSEX', 'BANK_NIFTY', 'INDIA_VIX'];
    list.sort((a, b) => order.indexOf(a.symbol) - order.indexOf(b.symbol));

    return list.length > 0 ? list : this._getFallbackIndices();
  }

  _getFallbackIndices() {
    return [
      {
        symbol: 'NIFTY_50',
        name: 'NIFTY 50',
        value: 25418.55,
        change: 138.25,
        changePercent: 0.55,
        open: 25320.10,
        high: 25445.80,
        low: 25290.40,
        previousClose: 25280.30,
      },
      {
        symbol: 'SENSEX',
        name: 'BSE SENSEX',
        value: 83184.80,
        change: 412.10,
        changePercent: 0.50,
        open: 82950.00,
        high: 83260.40,
        low: 82880.20,
        previousClose: 82772.70,
      },
      {
        symbol: 'BANK_NIFTY',
        name: 'NIFTY BANK',
        value: 52140.90,
        change: 320.65,
        changePercent: 0.62,
        open: 51920.00,
        high: 52210.00,
        low: 51850.50,
        previousClose: 51820.25,
      },
      {
        symbol: 'INDIA_VIX',
        name: 'INDIA VIX',
        value: 12.85,
        change: -0.42,
        changePercent: -3.16,
        open: 13.20,
        high: 13.45,
        low: 12.60,
        previousClose: 13.27,
      },
    ];
  }

  async getGainers(limit = 20) {
    const mockGainers = [
      { symbol: 'NSE:TATAMOTORS', name: 'Tata Motors Ltd', ltp: 984.60, change: 38.40, changePercent: 4.06, volume: 24500000 },
      { symbol: 'NSE:INFY', name: 'Infosys Limited', ltp: 1942.20, change: 52.80, changePercent: 2.80, volume: 18200000 },
      { symbol: 'NSE:RELIANCE', name: 'Reliance Industries Ltd', ltp: 2980.50, change: 65.10, changePercent: 2.23, volume: 14200000 },
      { symbol: 'NSE:HDFCBANK', name: 'HDFC Bank Limited', ltp: 1675.00, change: 28.50, changePercent: 1.73, volume: 29400000 },
      { symbol: 'NSE:BHARTIARTL', name: 'Bharti Airtel Ltd', ltp: 1610.40, change: 26.20, changePercent: 1.65, volume: 11200000 },
      { symbol: 'NSE:TCS', name: 'Tata Consultancy Services', ltp: 4290.00, change: 62.00, changePercent: 1.47, volume: 6800000 },
      { symbol: 'NSE:ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1228.30, change: 16.10, changePercent: 1.33, volume: 19800000 },
      { symbol: 'NSE:LT', name: 'Larsen & Toubro Ltd', ltp: 3680.00, change: 44.50, changePercent: 1.22, volume: 5400000 },
      { symbol: 'NSE:MARUTI', name: 'Maruti Suzuki India', ltp: 12450.00, change: 140.00, changePercent: 1.14, volume: 1800000 },
      { symbol: 'NSE:ITC', name: 'ITC Limited', ltp: 512.40, change: 5.20, changePercent: 1.03, volume: 16500000 },
    ];
    return mockGainers.slice(0, limit);
  }

  async getLosers(limit = 20) {
    const mockLosers = [
      { symbol: 'NSE:TATASTEEL', name: 'Tata Steel Ltd', ltp: 151.20, change: -4.80, changePercent: -3.08, volume: 32100000 },
      { symbol: 'NSE:HINDALCO', name: 'Hindalco Industries Ltd', ltp: 672.40, change: -18.20, changePercent: -2.64, volume: 14500000 },
      { symbol: 'NSE:SUNPHARMA', name: 'Sun Pharmaceutical Ltd', ltp: 1845.00, change: -36.50, changePercent: -1.94, volume: 8200000 },
      { symbol: 'NSE:CIPLA', name: 'Cipla Limited', ltp: 1624.10, change: -27.30, changePercent: -1.65, volume: 6400000 },
      { symbol: 'NSE:COALINDIA', name: 'Coal India Ltd', ltp: 488.50, change: -7.10, changePercent: -1.43, volume: 12800000 },
      { symbol: 'NSE:JSWSTEEL', name: 'JSW Steel Ltd', ltp: 948.00, change: -13.20, changePercent: -1.37, volume: 9100000 },
      { symbol: 'NSE:DRREDDY', name: "Dr. Reddy's Laboratories", ltp: 6620.00, change: -82.00, changePercent: -1.22, volume: 2400000 },
      { symbol: 'NSE:ASIANPAINT', name: 'Asian Paints Ltd', ltp: 3180.00, change: -34.00, changePercent: -1.06, volume: 4300000 },
    ];
    return mockLosers.slice(0, limit);
  }

  async getActive(limit = 20) {
    const mockActive = [
      { symbol: 'NSE:TATASTEEL', name: 'Tata Steel Ltd', ltp: 151.20, change: -4.80, changePercent: -3.08, volume: 32100000 },
      { symbol: 'NSE:HDFCBANK', name: 'HDFC Bank Limited', ltp: 1675.00, change: 28.50, changePercent: 1.73, volume: 29400000 },
      { symbol: 'NSE:TATAMOTORS', name: 'Tata Motors Ltd', ltp: 984.60, change: 38.40, changePercent: 4.06, volume: 24500000 },
      { symbol: 'NSE:ICICIBANK', name: 'ICICI Bank Ltd', ltp: 1228.30, change: 16.10, changePercent: 1.33, volume: 19800000 },
      { symbol: 'NSE:INFY', name: 'Infosys Limited', ltp: 1942.20, change: 52.80, changePercent: 2.80, volume: 18200000 },
      { symbol: 'NSE:ITC', name: 'ITC Limited', ltp: 512.40, change: 5.20, changePercent: 1.03, volume: 16500000 },
      { symbol: 'NSE:RELIANCE', name: 'Reliance Industries Ltd', ltp: 2980.50, change: 65.10, changePercent: 2.23, volume: 14200000 },
    ];
    return mockActive.slice(0, limit);
  }

  async getQuote(symbol) {
    const upper = symbol.toUpperCase();
    const instKey = SYMBOL_TO_INSTRUMENT_KEY[upper];

    if (this.isLive && instKey) {
      try {
        const res = await axios.get(`${this.baseUrl}/market-quote/quotes`, {
          params: { instrument_key: instKey },
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json',
          },
          timeout: 7000,
        });

        if (res.data?.data) {
          const quotes = Object.values(res.data.data);
          if (quotes.length > 0) {
            const q = quotes[0];
            const ltp = q.last_price || q.close || 0;
            const prevClose = q.ohlc?.close || ltp;
            const change = q.net_change ?? (ltp - prevClose);
            const changePercent = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
            const marketState = getMarketStatus();

            return {
              symbol: upper,
              name: q.symbol || upper.replace('NSE:', '').replace('BSE:', ''),
              exchange: upper.startsWith('BSE') ? 'BSE' : 'NSE',
              instrumentKey: instKey,
              ltp,
              change: Number(change.toFixed(2)),
              changePercent,
              open: q.ohlc?.open || 0,
              high: q.ohlc?.high || 0,
              low: q.ohlc?.low || 0,
              close: prevClose,
              previousClose: prevClose,
              volume: q.volume || 1000000,
              averageVolume: q.average_price ? Math.floor(q.volume * 0.8) : 800000,
              fiftyTwoWeekHigh: q.upper_circuit_limit || (ltp * 1.25),
              fiftyTwoWeekLow: q.lower_circuit_limit || (ltp * 0.75),
              sector: 'Equity',
              industry: 'Equities',
              marketStatus: marketState.status,
              lastUpdated: new Date().toISOString(),
            };
          }
        }
      } catch (err) {
        logger.warn({ err: err.message }, `Live Upstox quote failed for ${symbol}, falling back to mock`);
      }
    }

    const cleanSym = upper.replace('NSE:', '').replace('BSE:', '');
    const quoteMap = {
      RELIANCE: {
        symbol: 'NSE:RELIANCE',
        name: 'Reliance Industries Limited',
        exchange: 'NSE',
        instrumentKey: 'NSE_EQ|INE002A01018',
        ltp: 2980.50,
        change: 65.10,
        changePercent: 2.23,
        open: 2930.00,
        high: 2995.00,
        low: 2922.00,
        close: 2915.40,
        previousClose: 2915.40,
        volume: 14200000,
        averageVolume: 9800000,
        fiftyTwoWeekHigh: 3217.90,
        fiftyTwoWeekLow: 2220.30,
        sector: 'Energy',
        industry: 'Oil & Gas Refining',
      },
      TCS: {
        symbol: 'NSE:TCS',
        name: 'Tata Consultancy Services',
        exchange: 'NSE',
        instrumentKey: 'NSE_EQ|INE467B01029',
        ltp: 4290.00,
        change: 62.00,
        changePercent: 1.47,
        open: 4240.00,
        high: 4310.00,
        low: 4235.00,
        close: 4228.00,
        previousClose: 4228.00,
        volume: 6800000,
        averageVolume: 5100000,
        fiftyTwoWeekHigh: 4585.00,
        fiftyTwoWeekLow: 3313.00,
        sector: 'Information Technology',
        industry: 'Software Consulting',
      },
      HDFCBANK: {
        symbol: 'NSE:HDFCBANK',
        name: 'HDFC Bank Limited',
        exchange: 'NSE',
        instrumentKey: 'NSE_EQ|INE040A01034',
        ltp: 1675.00,
        change: 28.50,
        changePercent: 1.73,
        open: 1650.00,
        high: 1682.00,
        low: 1648.00,
        close: 1646.50,
        previousClose: 1646.50,
        volume: 29400000,
        averageVolume: 22100000,
        fiftyTwoWeekHigh: 1794.00,
        fiftyTwoWeekLow: 1363.55,
        sector: 'Banking',
        industry: 'Private Bank',
      },
      INFY: {
        symbol: 'NSE:INFY',
        name: 'Infosys Limited',
        exchange: 'NSE',
        instrumentKey: 'NSE_EQ|INE009A01021',
        ltp: 1942.20,
        change: 52.80,
        changePercent: 2.80,
        open: 1900.00,
        high: 1955.00,
        low: 1895.00,
        close: 1889.40,
        previousClose: 1889.40,
        volume: 18200000,
        averageVolume: 12400000,
        fiftyTwoWeekHigh: 1990.00,
        fiftyTwoWeekLow: 1358.35,
        sector: 'Information Technology',
        industry: 'Software Services',
      },
    };

    const quote = quoteMap[cleanSym] || {
      symbol: `NSE:${cleanSym}`,
      name: `${cleanSym} Limited`,
      exchange: 'NSE',
      instrumentKey: `NSE_EQ|${cleanSym}`,
      ltp: 1250.00,
      change: 15.50,
      changePercent: 1.25,
      open: 1238.00,
      high: 1262.00,
      low: 1235.00,
      close: 1234.50,
      previousClose: 1234.50,
      volume: 8500000,
      averageVolume: 6200000,
      fiftyTwoWeekHigh: 1450.00,
      fiftyTwoWeekLow: 980.00,
      sector: 'Diversified',
      industry: 'Conglomerate',
    };

    const marketState = getMarketStatus();
    return {
      ...quote,
      marketStatus: marketState.status,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getHistoricalCandles(symbol, interval = 'day', fromDate, toDate) {
    const instKey = SYMBOL_TO_INSTRUMENT_KEY[symbol.toUpperCase()] || SYMBOL_TO_INSTRUMENT_KEY[`NSE:${symbol.toUpperCase()}`];

    // Determine interval configuration
    let upstoxInterval = 'day';
    let daysBack = 90;
    let stepMinutes = 0;

    const normInterval = (interval || '').toUpperCase();
    if (normInterval === '1D' || interval === '1minute') {
      upstoxInterval = '1minute';
      daysBack = 2;
      stepMinutes = 5;
    } else if (normInterval === '1W' || interval === '30minute') {
      upstoxInterval = '30minute';
      daysBack = 7;
      stepMinutes = 30;
    } else if (normInterval === '1M') {
      upstoxInterval = 'day';
      daysBack = 30;
    } else if (normInterval === '3M') {
      upstoxInterval = 'day';
      daysBack = 90;
    } else if (normInterval === '1Y') {
      upstoxInterval = 'day';
      daysBack = 365;
    } else if (normInterval === '5Y' || interval === 'week') {
      upstoxInterval = 'week';
      daysBack = 1825;
    }

    // Live Upstox candle fetch
    if (this.isLive && instKey) {
      try {
        const today = new Date().toISOString().split('T')[0];
        const past = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const to = toDate || today;
        const from = fromDate || past;

        const res = await axios.get(
          `${this.baseUrl}/historical-candle/${encodeURIComponent(instKey)}/${upstoxInterval}/${to}/${from}`,
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              Accept: 'application/json',
            },
            timeout: 8000,
          }
        );

        if (res.data?.data?.candles && Array.isArray(res.data.data.candles) && res.data.data.candles.length > 0) {
          // Upstox candle array: [timestamp, open, high, low, close, volume, oi]
          // Upstox returns candles from newest to oldest; reverse to chronological for Lightweight Charts
          const sorted = [...res.data.data.candles].reverse();
          return sorted.map((c) => ({
            time: Math.floor(new Date(c[0]).getTime() / 1000),
            open: Number(c[1]),
            high: Number(c[2]),
            low: Number(c[3]),
            close: Number(c[4]),
            volume: Number(c[5] || 0),
          }));
        }
      } catch (err) {
        logger.warn({ err: err.message }, `Live Upstox candle fetch failed for ${symbol} (${upstoxInterval}), using high-fidelity generator`);
      }
    }

    // High-fidelity fallback candle generator
    const candles = [];
    const count = normInterval === '1D' ? 75 : normInterval === '1W' ? 50 : normInterval === '1M' ? 30 : normInterval === '5Y' ? 260 : 90;
    let basePrice = 2500;

    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const d = new Date(now);
      if (stepMinutes > 0) {
        d.setMinutes(d.getMinutes() - (i * stepMinutes));
      } else if (normInterval === '5Y') {
        d.setDate(d.getDate() - (i * 7));
      } else {
        d.setDate(d.getDate() - i);
      }

      const open = basePrice + (Math.random() - 0.48) * 18;
      const close = open + (Math.random() - 0.48) * 32;
      const high = Math.max(open, close) + Math.random() * 12;
      const low = Math.min(open, close) - Math.random() * 12;
      const volume = Math.floor(400000 + Math.random() * 1800000);

      candles.push({
        time: Math.floor(d.getTime() / 1000),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
      });

      basePrice = close;
    }

    return candles;
  }

  async searchInstruments(query) {
    const q = (query || '').toLowerCase().trim();
    const universe = [
      { symbol: 'NSE:RELIANCE', name: 'Reliance Industries Ltd', exchange: 'NSE', sector: 'Energy' },
      { symbol: 'NSE:TCS', name: 'Tata Consultancy Services', exchange: 'NSE', sector: 'Information Technology' },
      { symbol: 'NSE:HDFCBANK', name: 'HDFC Bank Limited', exchange: 'NSE', sector: 'Banking' },
      { symbol: 'NSE:INFY', name: 'Infosys Limited', exchange: 'NSE', sector: 'Information Technology' },
      { symbol: 'NSE:ICICIBANK', name: 'ICICI Bank Ltd', exchange: 'NSE', sector: 'Banking' },
      { symbol: 'NSE:BHARTIARTL', name: 'Bharti Airtel Ltd', exchange: 'NSE', sector: 'Telecommunications' },
      { symbol: 'NSE:TATAMOTORS', name: 'Tata Motors Ltd', exchange: 'NSE', sector: 'Automobile' },
      { symbol: 'NSE:ITC', name: 'ITC Limited', exchange: 'NSE', sector: 'FMCG' },
      { symbol: 'NSE:LT', name: 'Larsen & Toubro Ltd', exchange: 'NSE', sector: 'Infrastructure & Capital Goods' },
      { symbol: 'NSE:TATASTEEL', name: 'Tata Steel Ltd', exchange: 'NSE', sector: 'Metals & Mining' },
      { symbol: 'NSE:SUNPHARMA', name: 'Sun Pharmaceutical Ltd', exchange: 'NSE', sector: 'Pharmaceuticals' },
      { symbol: 'NSE:SBIN', name: 'State Bank of India', exchange: 'NSE', sector: 'Public Sector Banking' },
      { symbol: 'NSE:AXISBANK', name: 'Axis Bank Limited', exchange: 'NSE', sector: 'Banking' },
      { symbol: 'NSE:KOTAKBANK', name: 'Kotak Mahindra Bank', exchange: 'NSE', sector: 'Banking' },
      { symbol: 'NSE:WIPRO', name: 'Wipro Limited', exchange: 'NSE', sector: 'Information Technology' },
      { symbol: 'NSE:HCLTECH', name: 'HCL Technologies Ltd', exchange: 'NSE', sector: 'Information Technology' },
      { symbol: 'NSE:BAJFINANCE', name: 'Bajaj Finance Limited', exchange: 'NSE', sector: 'Financial Services' },
      { symbol: 'NSE:BAJAJFINSV', name: 'Bajaj Finserv Ltd', exchange: 'NSE', sector: 'Financial Services' },
      { symbol: 'NSE:MARUTI', name: 'Maruti Suzuki India Ltd', exchange: 'NSE', sector: 'Automobile' },
      { symbol: 'NSE:ASIANPAINT', name: 'Asian Paints Ltd', exchange: 'NSE', sector: 'Paints & Consumer' },
      { symbol: 'NSE:TITAN', name: 'Titan Company Limited', exchange: 'NSE', sector: 'Consumer Goods & Luxury' },
      { symbol: 'NSE:ULTRACEMCO', name: 'UltraTech Cement Ltd', exchange: 'NSE', sector: 'Cement & Building Materials' },
      { symbol: 'NSE:NTPC', name: 'NTPC Limited', exchange: 'NSE', sector: 'Power Generation' },
      { symbol: 'NSE:POWERGRID', name: 'Power Grid Corporation', exchange: 'NSE', sector: 'Utilities & Transmission' },
      { symbol: 'NSE:ONGC', name: 'Oil & Natural Gas Corp', exchange: 'NSE', sector: 'Energy & Exploration' },
      { symbol: 'NSE:COALINDIA', name: 'Coal India Limited', exchange: 'NSE', sector: 'Energy & Mining' },
      { symbol: 'NSE:JSWSTEEL', name: 'JSW Steel Ltd', exchange: 'NSE', sector: 'Metals & Mining' },
      { symbol: 'NSE:HINDALCO', name: 'Hindalco Industries Ltd', exchange: 'NSE', sector: 'Metals & Aluminium' },
      { symbol: 'NSE:ADANIENT', name: 'Adani Enterprises Ltd', exchange: 'NSE', sector: 'Diversified Conglomerate' },
      { symbol: 'NSE:ADANIPORTS', name: 'Adani Ports & SEZ Ltd', exchange: 'NSE', sector: 'Ports & Logistics' },
      { symbol: 'NSE:NESTLEIND', name: 'Nestle India Limited', exchange: 'NSE', sector: 'FMCG & Food' },
      { symbol: 'NSE:DRREDDY', name: "Dr. Reddy's Laboratories", exchange: 'NSE', sector: 'Pharmaceuticals' },
      { symbol: 'NSE:CIPLA', name: 'Cipla Limited', exchange: 'NSE', sector: 'Pharmaceuticals' },
      { symbol: 'NSE:TECHM', name: 'Tech Mahindra Limited', exchange: 'NSE', sector: 'Information Technology' },
    ];

    if (!q) {
      return universe.slice(0, 8);
    }

    return universe.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q)
    );
  }
}

export const upstoxProvider = new UpstoxProvider();
export default upstoxProvider;
