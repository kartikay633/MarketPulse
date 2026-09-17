-- ============================================
-- MARKET PULSE — Initial Schema
-- Migration: 001_initial_schema.sql
-- ROADMAP: Section 17 — Database Tables
-- ============================================

-- Auto-update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY,
  display_name    VARCHAR(100),
  avatar_url      TEXT,
  experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  interested_sectors TEXT[],
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. USER PREFERENCES
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id             UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  default_chart_type  VARCHAR(20) DEFAULT 'candlestick',
  default_timeframe   VARCHAR(10) DEFAULT '1D',
  notification_alerts BOOLEAN DEFAULT TRUE,
  notification_news   BOOLEAN DEFAULT FALSE,
  theme               VARCHAR(10) DEFAULT 'dark',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. INSTRUMENTS (synced from Upstox daily)
-- ============================================
CREATE TABLE IF NOT EXISTS instruments (
  id              SERIAL PRIMARY KEY,
  symbol          VARCHAR(30) NOT NULL,
  exchange        VARCHAR(10) NOT NULL,
  internal_symbol VARCHAR(50) NOT NULL UNIQUE,
  instrument_key  VARCHAR(100) NOT NULL,
  name            VARCHAR(200) NOT NULL,
  instrument_type VARCHAR(10) DEFAULT 'EQ',
  sector          VARCHAR(100),
  industry        VARCHAR(200),
  isin            VARCHAR(20),
  is_active       BOOLEAN DEFAULT TRUE,
  last_synced_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instruments_internal_symbol ON instruments(internal_symbol);
CREATE INDEX IF NOT EXISTS idx_instruments_symbol ON instruments(symbol);
CREATE INDEX IF NOT EXISTS idx_instruments_name ON instruments USING GIN (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_instruments_exchange ON instruments(exchange);
CREATE INDEX IF NOT EXISTS idx_instruments_sector ON instruments(sector);

-- ============================================
-- 4. WATCHLISTS
-- ============================================
CREATE TABLE IF NOT EXISTS watchlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL DEFAULT 'My Watchlist',
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);

CREATE TRIGGER set_watchlists_updated_at
  BEFORE UPDATE ON watchlists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS watchlist_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id  UUID NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  symbol        VARCHAR(50) NOT NULL,
  position      INTEGER DEFAULT 0,
  added_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(watchlist_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_watchlist_items_watchlist_id ON watchlist_items(watchlist_id);

-- ============================================
-- 5. PAPER TRADING
-- ============================================
CREATE TABLE IF NOT EXISTS paper_accounts (
  user_id       UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  cash_balance  NUMERIC(14,2) NOT NULL DEFAULT 1000000.00,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER set_paper_accounts_updated_at
  BEFORE UPDATE ON paper_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS paper_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol          VARCHAR(50) NOT NULL,
  side            VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  execution_price NUMERIC(12,2) NOT NULL,
  total_value     NUMERIC(14,2) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'EXECUTED',
  executed_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paper_orders_user_id ON paper_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_orders_symbol ON paper_orders(symbol);
CREATE INDEX IF NOT EXISTS idx_paper_orders_executed_at ON paper_orders(executed_at DESC);

CREATE TABLE IF NOT EXISTS paper_positions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol        VARCHAR(50) NOT NULL,
  quantity      INTEGER NOT NULL CHECK (quantity >= 0),
  average_price NUMERIC(12,2) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

CREATE INDEX IF NOT EXISTS idx_paper_positions_user_id ON paper_positions(user_id);

CREATE TRIGGER set_paper_positions_updated_at
  BEFORE UPDATE ON paper_positions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS paper_transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id      UUID NOT NULL REFERENCES paper_orders(id) ON DELETE CASCADE,
  symbol        VARCHAR(50) NOT NULL,
  side          VARCHAR(4) NOT NULL,
  quantity      INTEGER NOT NULL,
  price         NUMERIC(12,2) NOT NULL,
  realized_pl   NUMERIC(14,2),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paper_transactions_user_id ON paper_transactions(user_id);

-- ============================================
-- 6. PORTFOLIO SNAPSHOTS
-- ============================================
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  snapshot_date  DATE NOT NULL,
  total_value    NUMERIC(14,2) NOT NULL,
  cash_balance   NUMERIC(14,2) NOT NULL,
  invested_value NUMERIC(14,2) NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_user ON portfolio_snapshots(user_id, snapshot_date DESC);

-- ============================================
-- 7. ALERTS
-- ============================================
CREATE TABLE IF NOT EXISTS alerts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  symbol       VARCHAR(50) NOT NULL,
  condition    VARCHAR(30) NOT NULL CHECK (condition IN (
    'PRICE_ABOVE', 'PRICE_BELOW', 'PERCENT_CHANGE_UP', 'PERCENT_CHANGE_DOWN'
  )),
  target_value NUMERIC(12,2) NOT NULL,
  is_active    BOOLEAN DEFAULT TRUE,
  is_triggered BOOLEAN DEFAULT FALSE,
  triggered_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active, is_triggered);

-- ============================================
-- 8. AI CONVERSATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       VARCHAR(200),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

CREATE TRIGGER set_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS ai_messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  context_data    JSONB,
  token_count     INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

-- ============================================
-- 9. AI SUMMARIES (cached)
-- ============================================
CREATE TABLE IF NOT EXISTS ai_summaries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_type  VARCHAR(30) NOT NULL,
  content       TEXT NOT NULL,
  context_data  JSONB,
  generated_at  TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_type ON ai_summaries(summary_type, generated_at DESC);
