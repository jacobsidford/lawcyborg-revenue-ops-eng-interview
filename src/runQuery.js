/**
 * Query Runner
 * Executes SQL queries from queries.sql and displays results
 * 
 * Run with: npm run query
 */

import db from './db.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const queriesPath = join(__dirname, 'queries.sql');

console.log('📊 Running queries from queries.sql...\n');
console.log('─'.repeat(60));

try {
  const sql = readFileSync(queriesPath, 'utf-8');
  
  // Split by semicolons and filter out empty/comment-only statements
  const queries = sql
    .split(';')
    .map(q => q.trim())
    .filter(q => {
      // Remove comments and check if there's actual SQL
      const withoutComments = q
        .split('\n')
        .filter(line => !line.trim().startsWith('--'))
        .join('\n')
        .trim();
      return withoutComments.length > 0;
    });

  if (queries.length === 0) {
    console.log('No queries found. Add your SQL to src/queries.sql');
    process.exit(0);
  }

  let queryNum = 1;
  for (const query of queries) {
    console.log(`\n🔍 Query ${queryNum}:`);
    console.log('─'.repeat(40));
    
    // Show the query (abbreviated if long)
    const displayQuery = query.length > 200 
      ? query.substring(0, 200) + '...' 
      : query;
    console.log(displayQuery);
    console.log('─'.repeat(40));
    
    try {
      const stmt = db.prepare(query);
      const results = stmt.all();
      
      if (results.length === 0) {
        console.log('(No results)');
      } else {
        // Print results as table
        console.log('\nResults:');
        console.table(results);
      }
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
    
    queryNum++;
  }
  
  console.log('\n' + '─'.repeat(60));
  console.log('✅ Done!\n');
  
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('❌ queries.sql not found. Make sure you\'re in the right directory.');
  } else {
    console.error('❌ Error reading queries.sql:', err.message);
  }
  process.exit(1);
}

