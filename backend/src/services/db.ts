import { Pool } from 'pg';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const useSqlite = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost');

let pgPool: Pool | null = null;
let sqliteDb: sqlite3.Database | null = null;

if (useSqlite) {
  const dbPath = path.join(__dirname, '../../database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath);
  console.log('Using SQLite database at', dbPath);
} else {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  console.log('Using PostgreSQL database');
}

export const query = (text: string, params: any[] = []): Promise<any> => {
  if (useSqlite && sqliteDb) {
    return new Promise((resolve, reject) => {
      // Convert $1, $2 to ?, ? for SQLite
      const sqliteQuery = text.replace(/\$\d+/g, '?');
      
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        sqliteDb!.all(sqliteQuery, params, (err, rows: any) => {
          if (err) reject(err);
          else {
            const parsedRows = rows.map((row: any) => {
              if (row.data && typeof row.data === 'string') {
                try { row.data = JSON.parse(row.data); } catch (e) {}
              }
              return row;
            });
            resolve({ rows: parsedRows });
          }
        });
      } else {
        // For INSERT/UPDATE, stringify data if it's an object
        const processedParams = params.map(p => (typeof p === 'object' ? JSON.stringify(p) : p));
        sqliteDb!.run(sqliteQuery, processedParams, function (err) {
          if (err) reject(err);
          else resolve({ rows: [{ id: this.lastID }], rowCount: this.changes });
        });
      }
    });
  } else if (pgPool) {
    return pgPool.query(text, params);
  }
  throw new Error('No database connection');
};

export const initDb = async () => {
  const isSqlite = useSqlite;
  const idType = isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'SERIAL PRIMARY KEY';
  const jsonType = isSqlite ? 'TEXT' : 'JSONB';

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id ${idType},
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS dynamic_data (
      id ${idType},
      table_name TEXT NOT NULL,
      data ${jsonType} NOT NULL,
      user_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
