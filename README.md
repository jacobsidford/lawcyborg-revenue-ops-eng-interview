# Revenue Operations Engineer — Technical Interview

Welcome! This folder contains everything you need to complete the interview.

## Quick Start

```bash
# Install dependencies
npm install

# Seed the database with test data
npm run setup
```

That's it! You now have a local SQLite database (`interview.db`) with mock data.

## Your Tasks

**Summary:**
1. **Part 1 (Coding):** Complete the function in `src/logCitationExport.js`
2. **Part 2 (SQL):** Write your queries in `src/queries.sql`
3. **Part 2.3 (Business):** Write your analysis in `ANALYSIS.md`

## Helpful Commands

```bash
# Run your queries against the database
npm run query

# Test your logCitationExport function
npm run test
```

## File Structure

```
interview/
├── README.md              # You are here
├── INSTRUCTIONS.md        # Full interview prompt
├── ANALYSIS.md            # Write your Part 2.3 answers here
├── interview.db           # SQLite database (created after npm run setup)
├── package.json
└── src/
    ├── db.js              # Database connection (do not modify)
    ├── seed.js            # Seeds the database (do not modify)
    ├── logCitationExport.js   # ← Part 1: Complete this function
    ├── queries.sql        # ← Part 2: Write your SQL here
    ├── runQuery.js        # Helper to run your queries
    └── test.js            # Tests your logCitationExport function
```

## Need Help?

- The database uses **SQLite** syntax (very similar to PostgreSQL)
- You can inspect the database with any SQLite viewer, or use `npm run query`
- If you get stuck on setup, please reach out

Good luck!

