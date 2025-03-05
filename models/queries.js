//this file will create an async function in which connection is made and a function with query result is returned
//then export the function
//the call these function in the controller depends on send or recieve get or post

const pool = require('./connectionDB');

async function buyerData() {
  let connection;
  try {
      connection = await pool.getConnection();
      const [results] = await connection.query("SELECT * FROM buyer");
     
     return results;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

async function insertBuyer(fName, emailAddress, birthday, phoneNumber, password) {
  const connection = await pool.getConnection();
  try {
      const query = "INSERT INTO buyer (fullName, email, dob, phoneN, password) VALUES (?, ?, ?, ?, ?)";
      await connection.query(query, [fName, emailAddress, birthday, phoneNumber, password]);
      return true; // Return true if insertion is successful
  } catch (error) {
      console.error('Error:', error);
      throw error; // Propagate the error
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

const getTables = async () => {
 try {
   const [tables] = await pool.query('SHOW TABLES');  // Run the 'SHOW TABLES' query
   return tables.map(table => Object.values(table)[0]); // Extract and return table names
 } catch (err) {
   console.error('Error:', err);
   throw err;
 }
};

module.exports = {buyerData, insertBuyer, getTables};  // Export query function for use in other files