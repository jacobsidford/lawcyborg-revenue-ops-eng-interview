/**
 * Test Script for logCitationExport
 * 
 * Run with: npm run test
 */

import db from './db.js';
import { logCitationExport } from './logCitationExport.js';

console.log('🧪 Testing logCitationExport function...\n');

// Check if database exists
try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    console.log('⚠️  Database is empty. Run "npm run setup" first.\n');
    process.exit(1);
  }
} catch (err) {
  console.log('⚠️  Database not found. Run "npm run setup" first.\n');
  process.exit(1);
}

// Get count before
const beforeCount = db.prepare(
  "SELECT COUNT(*) as count FROM events WHERE event_name = 'citation_export'"
).get().count;

console.log(`Events before: ${beforeCount}`);

// Test 1: Basic functionality
console.log('\n─────────────────────────────────────');
console.log('Test 1: Basic insert (userId=1, format=pdf, count=5)');
console.log('─────────────────────────────────────');

try {
  logCitationExport(1, 'pdf', 5);
  console.log('✓ Function executed without error');
} catch (err) {
  console.log(`✗ Function threw error: ${err.message}`);
}

// Check if event was inserted
const afterCount = db.prepare(
  "SELECT COUNT(*) as count FROM events WHERE event_name = 'citation_export'"
).get().count;

if (afterCount > beforeCount) {
  console.log('✓ Event was inserted into database');
  
  // Check the inserted record
  const lastEvent = db.prepare(`
    SELECT * FROM events 
    WHERE event_name = 'citation_export' 
    ORDER BY id DESC 
    LIMIT 1
  `).get();
  
  console.log('\nInserted record:');
  console.log(`  user_id: ${lastEvent.user_id}`);
  console.log(`  event_name: ${lastEvent.event_name}`);
  console.log(`  properties: ${lastEvent.properties}`);
  console.log(`  created_at: ${lastEvent.created_at}`);
  
  // Validate properties
  try {
    const props = JSON.parse(lastEvent.properties);
    if (props.format === 'pdf' && props.citation_count === 5) {
      console.log('✓ Properties are correct');
    } else {
      console.log('✗ Properties have wrong values');
      console.log(`  Expected: { format: 'pdf', citation_count: 5 }`);
      console.log(`  Got: ${JSON.stringify(props)}`);
    }
  } catch (e) {
    console.log('✗ Properties is not valid JSON');
  }
} else {
  console.log('✗ Event was NOT inserted (count unchanged)');
}

// Test 2: Input validation (optional - bonus points)
console.log('\n─────────────────────────────────────');
console.log('Test 2: Invalid format (should throw or handle gracefully)');
console.log('─────────────────────────────────────');

try {
  logCitationExport(1, 'invalid_format', 5);
  console.log('⚠ Function accepted invalid format (consider adding validation)');
} catch (err) {
  console.log(`✓ Function correctly rejected invalid format: ${err.message}`);
}

// Test 3: Negative citation count (optional - bonus points)
console.log('\n─────────────────────────────────────');
console.log('Test 3: Negative citation count');
console.log('─────────────────────────────────────');

try {
  logCitationExport(1, 'docx', -1);
  console.log('⚠ Function accepted negative count (consider adding validation)');
} catch (err) {
  console.log(`✓ Function correctly rejected negative count: ${err.message}`);
}

console.log('\n═════════════════════════════════════');
console.log('Testing complete!');
console.log('═════════════════════════════════════\n');

