// ROADMAP: Section 8 — Market Data Provider Abstraction Interface
export class MarketDataProvider {
  /**
   * Get real-time overview of major indices, breadth, and sector performance
   */
  async getMarketOverview() {
    throw new Error('getMarketOverview must be implemented by provider');
  }

  /**
   * Get major Indian market indices (NIFTY 50, SENSEX, BANK NIFTY, INDIA VIX, etc.)
   */
  async getIndices() {
    throw new Error('getIndices must be implemented by provider');
  }

  /**
   * Get top gaining stocks
   */
  async getGainers(limit = 20) {
    throw new Error('getGainers must be implemented by provider');
  }

  /**
   * Get top losing stocks
   */
  async getLosers(limit = 20) {
    throw new Error('getLosers must be implemented by provider');
  }

  /**
   * Get most active stocks by trading volume
   */
  async getActive(limit = 20) {
    throw new Error('getActive must be implemented by provider');
  }

  /**
   * Get real-time quote for a single stock symbol
   */
  async getQuote(symbol) {
    throw new Error('getQuote must be implemented by provider');
  }

  /**
   * Get historical candle bars for a symbol
   */
  async getHistoricalCandles(symbol, interval, fromDate, toDate) {
    throw new Error('getHistoricalCandles must be implemented by provider');
  }

  /**
   * Search instruments by name or symbol
   */
  async searchInstruments(query) {
    throw new Error('searchInstruments must be implemented by provider');
  }
}

export default MarketDataProvider;
