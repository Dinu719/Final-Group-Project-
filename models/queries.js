// queries.js
const pool = require('./connectionDB');
// Query to get tables from the group2 database
const getTables = async () => {
 try {
   const [tables] = await pool.query('SHOW TABLES');  // Run the 'SHOW TABLES' query
   return tables.map(table => Object.values(table)[0]); // Extract and return table names
 } catch (err) {
   console.error('Error:', err);
   throw err;
 }
};
module.exports = { getTables };  // Export query function for use in other files
