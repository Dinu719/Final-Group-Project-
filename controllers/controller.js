// controller.js
const { getTables } = require("../models/queries");  // Import the query from queries file
// Function to get tables and log them to the terminal
const showTables = async () => {
 try {
   const tableNames = await getTables();  // Call the query to get tables
   console.log('group2:');
   console.log(JSON.stringify({ tables: tableNames }, null, 2));  // Log result
 } catch (err) {
   console.error('Error:', err);
 }
};
module.exports = { showTables };  // Export the function to use elsewhere if needed
