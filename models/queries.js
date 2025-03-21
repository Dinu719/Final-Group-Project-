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

// Create Account
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

// Sign In
async function getBuyer(email) {
  const connection = await pool.getConnection();
  try {
    const query = "SELECT * FROM buyer WHERE email = ?";
    const [rows] = await connection.query(query, [email]);
    return rows;
  } catch (error) {
      console.error('Error:', error);
      throw error;
  } finally {
      if (connection) {
          connection.release();
      }
  }
}

// Change Details
async function updateBuyer(bID, fullName, emailAddress, DOB, phoneNumber, password) {
  const connection = await pool.getConnection();
  try {
    let query = 'UPDATE buyer SET ';
    const fields = [];
    const values = [];
    if (fullName !== undefined) {
      fields.push('fullName = ?');
      values.push(fullName);
    }
    if (emailAddress !== undefined) {
      fields.push('email = ?');
      values.push(emailAddress);
    }
    if (DOB !== undefined) {
      fields.push('dob = ?');
      values.push(DOB);
    }
    if (phoneNumber !== undefined) {
      fields.push('phoneN = ?');
      values.push(phoneNumber);
    }
    if (password !== undefined) {
      fields.push('password = ?');
      values.push(password);
    }
    if (fields.length === 0) {
      throw new Error('No Fields to Update');
    }
    query += fields.join(', ') + ' WHERE bID = ?';
    values.push(bID);
    await connection.query(query, values);
    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
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

module.exports = {buyerData, insertBuyer, getBuyer, updateBuyer, getTables};  // Export query function for use in other files