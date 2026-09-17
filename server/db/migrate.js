// ROADMAP: Section 7 — Database Architecture (Migration Runner)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

/**
 * Simple migration runner.
 * Executes SQL files in order from the migrations/ directory.
 * Tracks which migrations have been applied in a `_migrations` table.
 */
export async function runMigrations() {
  // Create migrations tracking table if it doesn't exist
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Get already-applied migrations
  const { rows: applied } = await query('SELECT name FROM _migrations ORDER BY id');
  const appliedSet = new Set(applied.map((r) => r.name));

  // Get migration files
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let migrationsRun = 0;

  for (const file of files) {
    if (appliedSet.has(file)) {
      logger.debug(`Migration ${file} already applied, skipping`);
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    logger.info(`Running migration: ${file}`);

    try {
      await query(sql);
      await query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      migrationsRun++;
      logger.info(`Migration ${file} applied successfully`);
    } catch (err) {
      logger.error({ err, migration: file }, `Migration ${file} failed`);
      throw err;
    }
  }

  if (migrationsRun === 0) {
    logger.info('No new migrations to apply');
  } else {
    logger.info(`Applied ${migrationsRun} migration(s)`);
  }
}
