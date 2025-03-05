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
module.exports = { getTables }; 

async function insertUser(fullName, email, phoneN, password){
  const connection=await pool.getConnection();

  try {
    let sql, values;
    
      sql = `INSERT INTO buyer (fullName, email, phoneN, password)
      VALUES (?, ?, ?, ?)`;

        values  = [fullName, email, phoneN, password];

        console.log ("Running:", sql);
        console.log ("With Values:", values);

        const[result] = await connection.query(sql, values);

        console.log("insert result", result);
    }

    catch(error) {
      console.error (`error inserting data:`, error);
      throw error;
    }

    finally{
      if(connection){
        connection.release();
      }
    }

  }

module.exports = {insertUser};
// Export query function for use in other files
