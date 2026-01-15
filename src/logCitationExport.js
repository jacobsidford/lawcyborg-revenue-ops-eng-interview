/**
 * Part 1: Event Instrumentation
 * 
 * Complete this function to log citation export events to the database.
 * 
 * Requirements:
 * - event_name should be 'citation_export'
 * - properties should be a JSON string containing:
 *   - format: The export format ('pdf' or 'docx')
 *   - citation_count: The number of citations (integer)
 * - Handle potential errors gracefully
 */

import db from './db.js';

/**
 * Logs a citation export event to the events table.
 * 
 * @param {number} userId - The ID of the user performing the export
 * @param {string} exportFormat - Either 'pdf' or 'docx'
 * @param {number} citationCount - Number of citations in the export
 */
function logCitationExport(userId, exportFormat, citationCount) {
  // TODO: Implement this function
  // 
  // Hint: You can use db.prepare() and .run() to execute SQL
  // Example:
  //   const stmt = db.prepare('INSERT INTO table (col1, col2) VALUES (?, ?)');
  //   stmt.run(value1, value2);
  
}

export { logCitationExport };

