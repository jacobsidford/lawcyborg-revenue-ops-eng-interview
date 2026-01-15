# Revenue Operations Engineer — Technical Interview

**Your Role Today:** We recently launched a new feature called **Citation Export**, which allows users to export their research citations as PDF or DOCX files. The Product team believes this feature is a strong indicator of user engagement, but we don't have data to prove it yet.

Your task is to:
1. **Instrument** the feature so we can collect data.
2. **Analyze** the data to determine if `Citation Export` usage correlates with paid conversions.

---

## Part 1: Instrumentation (Coding)

**Time Estimate:** 15–20 minutes

We have a simple backend service. Your job is to implement the event logging for the `Citation Export` feature.

### The Schema

We have an `events` table in our database:

```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    properties TEXT,  -- JSON string
    created_at TEXT DEFAULT (datetime('now'))
);
```

### Your Task

Open `src/logCitationExport.js` and complete the function. When a user exports a citation, this function should insert a row into the `events` table.

**Requirements:**
- `event_name` should be `'citation_export'`
- `properties` should be a JSON string containing:
  - `format`: The export format (`'pdf'` or `'docx'`)
  - `citation_count`: The number of citations in the export (integer)
- Handle potential errors gracefully

**Test your implementation:**
```bash
npm run test
```

### Bonus (if time permits)
- What would you add to make this function more robust in a production environment?
- How would you test this function?

---

## Part 2: Data Analysis (SQL)

**Time Estimate:** 25–30 minutes

The feature has been live for 3 months. We now have data and need to analyze it.

### The Schema

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    signup_date TEXT NOT NULL,
    plan TEXT NOT NULL,    -- 'free', 'professional', 'enterprise'
    converted_at TEXT,     -- NULL if still on free plan
    churned_at TEXT        -- NULL if still active
);

-- Events table
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    properties TEXT,       -- JSON string
    created_at TEXT DEFAULT (datetime('now'))
);
```

**Available `event_name` values:**
- `'search'` — User performed a search query
- `'citation_export'` — User exported citations (has `format` and `citation_count` in properties)
- `'document_view'` — User viewed a legal document
- `'invite_teammate'` — User invited a colleague

---

### Task 2.1: Conversion Rate by Feature Usage

Write a SQL query in `src/queries.sql` that calculates the **conversion rate to a paid plan** for two groups:
1. Users who have used `citation_export` at least once
2. Users who have **never** used `citation_export`

Your output should look like:

| used_citation_export | total_users | converted_users | conversion_rate |
|----------------------|-------------|-----------------|-----------------|
| Yes                  | 150         | 45              | 30.00%          |
| No                   | 350         | 35              | 10.00%          |

---

### Task 2.2: Time to Conversion

Write a SQL query to calculate the **average number of days from signup to conversion** for users who converted, grouped by whether they used `citation_export`.

| used_citation_export | avg_days_to_convert |
|----------------------|---------------------|
| Yes                  | 12.5                |
| No                   | 28.3                |

**Hint:** In SQLite, you can calculate days between dates using:
```sql
julianday(date1) - julianday(date2)
```

---

### Task 2.3: Business Recommendation

1. **Is `Citation Export` a strong activation signal?** Justify your answer with the data.

2. **Should we prompt new users to try Citation Export during onboarding?** What are the risks of forcing feature adoption?

3. **What additional data would you want to collect** to strengthen this analysis?

---

## Running Your Queries

```bash
# This will execute all queries in src/queries.sql and show results
npm run query
```

---

## Submission

Please ensure you have completed:
- [ ] `src/logCitationExport.js` — Your function implementation
- [ ] `src/queries.sql` — Your SQL queries for Task 2.1 and 2.2
- [ ] `ANALYSIS.md` — Your written analysis for Task 2.3

Good luck!

