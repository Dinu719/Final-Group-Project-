const {buyerData, insertBuyer, getTables} = require("../models/queries");

async function processBD() {
  try {
      const data = await buyerData();
      return data;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

async function addBuyer(fName, emailAddress, birthday, phoneNumber, password) {
  try {
      await insertBuyer(fName, emailAddress, birthday, phoneNumber, password);
  } catch (error) {
      console.error('Error:', error);
      throw error;
  }
}

const showTables = async () => {
 try {
   const tableNames = await getTables();  // Call the query to get tables
   console.log('group2:');
   console.log(JSON.stringify({ tables: tableNames }, null, 2));  // Log result
 } catch (err) {
   console.error('Error:', err);
 }
};

module.exports = {processBD, addBuyer, showTables};  // Export the function to use elsewhere if needed