// ROADMAP: Section 9 — News Provider Abstract Interface
export class NewsProvider {
  /**
   * Fetch general market news articles
   * @param {Object} options { limit, category, page }
   * @returns {Promise<Array<NewsArticle>>}
   */
  async getMarketNews(options = {}) {
    throw new Error('NewsProvider.getMarketNews() must be implemented');
  }

  /**
   * Fetch news articles specific to a stock symbol
   * @param {string} symbol
   * @param {Object} options { limit, page }
   * @returns {Promise<Array<NewsArticle>>}
   */
  async getStockNews(symbol, options = {}) {
    throw new Error('NewsProvider.getStockNews() must be implemented');
  }
}

export default NewsProvider;
