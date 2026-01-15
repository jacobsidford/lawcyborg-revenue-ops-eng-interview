/**
 * Database connection module
 * Uses better-sqlite3 for a local SQLite database
 * 
 * DO NOT MODIFY THIS FILE
 */

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'interview.db');

// Create or connect to the database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

export default db;

