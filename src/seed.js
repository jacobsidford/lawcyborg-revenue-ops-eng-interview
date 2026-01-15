/**
 * Database Seed Script
 * Creates tables and populates with mock data
 * 
 * Run with: npm run setup
 * 
 * DO NOT MODIFY THIS FILE
 */

import db from './db.js';

console.log('🌱 Seeding database...\n');

// Drop existing tables
db.exec(`DROP TABLE IF EXISTS events`);
db.exec(`DROP TABLE IF EXISTS users`);

// Create tables
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    signup_date TEXT NOT NULL,
    plan TEXT NOT NULL,
    converted_at TEXT,
    churned_at TEXT
  )
`);

db.exec(`
  CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    properties TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Create indexes
db.exec(`CREATE INDEX idx_events_user_id ON events(user_id)`);
db.exec(`CREATE INDEX idx_events_event_name ON events(event_name)`);

// Prepare insert statements
const insertUser = db.prepare(`
  INSERT INTO users (email, signup_date, plan, converted_at, churned_at)
  VALUES (?, ?, ?, ?, ?)
`);

const insertEvent = db.prepare(`
  INSERT INTO events (user_id, event_name, properties, created_at)
  VALUES (?, ?, ?, ?)
`);

// Helper to generate random date within range
function randomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

function randomDateTime(baseDate, maxDaysAfter) {
  const base = new Date(baseDate);
  const daysAfter = Math.random() * maxDaysAfter;
  const hoursAfter = Math.random() * 24;
  base.setDate(base.getDate() + Math.floor(daysAfter));
  base.setHours(Math.floor(hoursAfter), Math.floor(Math.random() * 60), 0);
  return base.toISOString().replace('T', ' ').substring(0, 19);
}

function addDays(dateStr, days) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// ============================================
// SEED USERS
// ============================================
// Hidden signals embedded in data:
// 1. Citation Export → higher conversion (primary signal)
// 2. Early export (within 3 days) → even higher conversion
// 3. case_law viewers → higher conversion than legislation viewers
// 4. Team invites → lower churn
// 5. Feature breadth (3+ features) → higher conversion
// ============================================

const users = [];

// Group 1: Citation Export Users - Converted (45 users)
// Subgroup A: Early exporters (within 3 days) - 30 users, ~40% of early exporters convert
// Subgroup B: Late exporters (after 3 days) - 15 users
for (let i = 1; i <= 30; i++) {
  const signupDate = randomDate('2025-10-01', '2025-12-15');
  const daysToConvert = Math.floor(Math.random() * 8) + 5; // 5-12 days (faster)
  const plan = Math.random() > 0.75 ? 'enterprise' : 'professional';
  users.push({
    email: `user${String(i).padStart(3, '0')}@lawfirm.co.nz`,
    signup_date: signupDate,
    plan: plan,
    converted_at: addDays(signupDate, daysToConvert),
    churned_at: null,
    usedExport: true,
    earlyExporter: true,  // Exported within 3 days
    primaryDocType: 'case_law',  // Lawyers
    willInvite: Math.random() > 0.4,  // 60% invite
    featureBreadth: 3  // Uses all features
  });
}

// Late exporters who converted (15 users)
for (let i = 31; i <= 45; i++) {
  const signupDate = randomDate('2025-10-01', '2025-12-15');
  const daysToConvert = Math.floor(Math.random() * 12) + 12; // 12-23 days (slower)
  const plan = Math.random() > 0.85 ? 'enterprise' : 'professional';
  users.push({
    email: `user${String(i).padStart(3, '0')}@lawfirm.co.nz`,
    signup_date: signupDate,
    plan: plan,
    converted_at: addDays(signupDate, daysToConvert),
    churned_at: null,
    usedExport: true,
    earlyExporter: false,  // Exported after 3 days
    primaryDocType: Math.random() > 0.5 ? 'case_law' : 'legislation',
    willInvite: Math.random() > 0.6,  // 40% invite
    featureBreadth: 2
  });
}

// Group 2: Citation Export Users - Free (105 users)
// Mix of early and late exporters who didn't convert
for (let i = 46; i <= 150; i++) {
  const signupDate = randomDate('2025-10-01', '2025-12-31');
  const isEarly = Math.random() > 0.7; // 30% are early exporters
  users.push({
    email: `user${String(i).padStart(3, '0')}@accounting.co.nz`,
    signup_date: signupDate,
    plan: 'free',
    converted_at: null,
    churned_at: null,
    usedExport: true,
    earlyExporter: isEarly,
    primaryDocType: 'legislation',  // Accountants - lower conversion signal
    willInvite: false,
    featureBreadth: Math.random() > 0.7 ? 2 : 1
  });
}

// Group 3: Non-Export Users - Converted (35 users)
// These users never used citation_export but still converted (slower)
for (let i = 151; i <= 185; i++) {
  const signupDate = randomDate('2025-10-01', '2025-11-30');
  const daysToConvert = Math.floor(Math.random() * 15) + 22; // 22-36 days
  const plan = Math.random() > 0.85 ? 'enterprise' : 'professional';
  const docType = Math.random() > 0.6 ? 'case_law' : 'legislation';
  users.push({
    email: `user${String(i).padStart(3, '0')}@corporate.co.nz`,
    signup_date: signupDate,
    plan: plan,
    converted_at: addDays(signupDate, daysToConvert),
    churned_at: null,
    usedExport: false,
    earlyExporter: false,
    primaryDocType: docType,
    willInvite: Math.random() > 0.5,  // 50% invite
    featureBreadth: 2
  });
}

// Group 4: Non-Export Users - Free (315 users)
for (let i = 186; i <= 500; i++) {
  const signupDate = randomDate('2025-10-01', '2025-12-31');
  users.push({
    email: `user${String(i).padStart(3, '0')}@freeuser.co.nz`,
    signup_date: signupDate,
    plan: 'free',
    converted_at: null,
    churned_at: null,
    usedExport: false,
    earlyExporter: false,
    primaryDocType: Math.random() > 0.3 ? 'legislation' : 'commentary',  // Casual users
    willInvite: false,
    featureBreadth: 1
  });
}

// Group 5: Churned Users (50 users) - to enable churn analysis
// Hidden signal: Users who invited teammates churn less
for (let i = 501; i <= 550; i++) {
  const signupDate = randomDate('2025-10-01', '2025-11-15');
  const daysToConvert = Math.floor(Math.random() * 10) + 10;
  const daysToChurn = Math.floor(Math.random() * 30) + 30; // Churned 30-60 days after signup
  users.push({
    email: `user${String(i).padStart(3, '0')}@churned.co.nz`,
    signup_date: signupDate,
    plan: 'professional',
    converted_at: addDays(signupDate, daysToConvert),
    churned_at: addDays(signupDate, daysToChurn),
    usedExport: Math.random() > 0.6,  // 40% used export
    earlyExporter: false,
    primaryDocType: 'legislation',
    willInvite: false,  // Key signal: churned users rarely invited teammates
    featureBreadth: 1
  });
}

// Group 6: Active users who invited teammates (30 users) - low churn signal
for (let i = 551; i <= 580; i++) {
  const signupDate = randomDate('2025-10-01', '2025-11-30');
  const daysToConvert = Math.floor(Math.random() * 10) + 8;
  users.push({
    email: `user${String(i).padStart(3, '0')}@teamuser.co.nz`,
    signup_date: signupDate,
    plan: Math.random() > 0.7 ? 'enterprise' : 'professional',
    converted_at: addDays(signupDate, daysToConvert),
    churned_at: null,  // Key signal: inviters don't churn
    usedExport: true,
    earlyExporter: Math.random() > 0.5,
    primaryDocType: 'case_law',
    willInvite: true,  // All invite
    featureBreadth: 3
  });
}

// Insert users
const insertUsers = db.transaction(() => {
  for (const user of users) {
    insertUser.run(
      user.email,
      user.signup_date,
      user.plan,
      user.converted_at,
      user.churned_at
    );
  }
});
insertUsers();

console.log(`✓ Created ${users.length} users`);

// ============================================
// SEED EVENTS
// ============================================

let eventCount = 0;

const insertEvents = db.transaction(() => {
  for (let userId = 1; userId <= users.length; userId++) {
    const user = users[userId - 1];
    
    // Everyone does searches (5-25 per user)
    const searchCount = Math.floor(Math.random() * 20) + 5;
    for (let j = 0; j < searchCount; j++) {
      insertEvent.run(
        userId,
        'search',
        JSON.stringify({ query_length: Math.floor(Math.random() * 100) + 10 }),
        randomDateTime(user.signup_date, 30)
      );
      eventCount++;
    }
    
    // Document views - weighted by primaryDocType
    // This creates the hidden signal: case_law viewers convert more
    if (user.featureBreadth >= 2 || Math.random() > 0.3) {
      const viewCount = Math.floor(Math.random() * 10) + 3;
      for (let j = 0; j < viewCount; j++) {
        // Weight document type based on user's primary type
        let docType;
        const rand = Math.random();
        if (rand < 0.6) {
          docType = user.primaryDocType;
        } else if (rand < 0.85) {
          docType = 'commentary';
        } else {
          docType = user.primaryDocType === 'case_law' ? 'legislation' : 'case_law';
        }
        
        insertEvent.run(
          userId,
          'document_view',
          JSON.stringify({ document_type: docType }),
          randomDateTime(user.signup_date, 30)
        );
        eventCount++;
      }
    }
    
    // Citation export - with early/late timing signal
    if (user.usedExport) {
      const exportCount = Math.floor(Math.random() * 5) + 1;
      const formats = ['pdf', 'docx'];
      for (let j = 0; j < exportCount; j++) {
        // Early exporters: within 3 days. Late exporters: 4-14 days
        const maxDays = user.earlyExporter ? 3 : 14;
        const minDays = user.earlyExporter ? 0 : 4;
        const daysAfter = Math.random() * (maxDays - minDays) + minDays;
        
        const exportDate = new Date(user.signup_date);
        exportDate.setDate(exportDate.getDate() + Math.floor(daysAfter));
        exportDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0);
        
        insertEvent.run(
          userId,
          'citation_export',
          JSON.stringify({
            format: formats[Math.floor(Math.random() * 2)],
            citation_count: Math.floor(Math.random() * 15) + 1
          }),
          exportDate.toISOString().replace('T', ' ').substring(0, 19)
        );
        eventCount++;
      }
    }
    
    // Team invites - key retention signal
    if (user.willInvite) {
      const inviteCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < inviteCount; j++) {
        const inviteDate = user.converted_at 
          ? randomDateTime(user.converted_at, 14)
          : randomDateTime(user.signup_date, 21);
        
        insertEvent.run(
          userId,
          'invite_teammate',
          JSON.stringify({ invitee_email: `colleague${Math.floor(Math.random() * 100)}@example.com` }),
          inviteDate
        );
        eventCount++;
      }
    }
  }
});
insertEvents();

console.log(`✓ Created ${eventCount} events`);

// Summary stats
const stats = db.prepare(`
  SELECT 
    plan,
    COUNT(*) as count
  FROM users
  GROUP BY plan
`).all();

console.log('\n📊 User Distribution:');
for (const row of stats) {
  console.log(`   ${row.plan}: ${row.count}`);
}

const churnStats = db.prepare(`
  SELECT 
    CASE WHEN churned_at IS NOT NULL THEN 'Churned' ELSE 'Active' END as status,
    COUNT(*) as count
  FROM users
  WHERE plan != 'free'
  GROUP BY status
`).all();

console.log('\n📊 Retention (Paid Users):');
for (const row of churnStats) {
  console.log(`   ${row.status}: ${row.count}`);
}

const exporterStats = db.prepare(`
  SELECT 
    CASE WHEN e.user_id IS NOT NULL THEN 'Exporters' ELSE 'Non-Exporters' END as group_name,
    COUNT(DISTINCT u.id) as user_count
  FROM users u
  LEFT JOIN (SELECT DISTINCT user_id FROM events WHERE event_name = 'citation_export') e
    ON u.id = e.user_id
  GROUP BY group_name
`).all();

console.log('\n📊 Feature Usage:');
for (const row of exporterStats) {
  console.log(`   ${row.group_name}: ${row.user_count}`);
}

console.log('\n✅ Database seeded successfully!');
console.log('   Database file: interview.db\n');
