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

// Update Password
const updatePassword = async (email, newPassword) => {
  try {
    const db = 'UPDATE buyer SET password = ? WHERE email = ?';
    const [result] = await pool.query(db, [newPassword, email]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Laptop Cases
async function getLaptopCases() {
  let connection;
  try {
    connection = await pool.getConnection();
    const laptopCasesQuery = `
      SELECT p.prID, p.prDescription, p.Price, p.Stock, c.coName AS color, n.prName AS name
      FROM products p
      JOIN category ca ON p.caID = ca.caID
      JOIN color c ON p.coID = c.coID
      JOIN name n ON p.nID = n.nID
      WHERE ca.caName = 'Tech Products' AND n.prName = 'Laptop Case'
    `;
    const [laptopCases] = await connection.query(laptopCasesQuery);
    const logosQuery = 'SELECT loID, loName FROM logo';
    const [logos] = await connection.query(logosQuery);
    return {laptopCases, logos};
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// iPhone Cases
async function getiPhoneCases() {
  let connection;
  try {
    connection = await pool.getConnection();
    const iPhoneCasesQuery = `
      SELECT p.prID, p.prDescription, p.Price, p.Stock, c.coName AS color, n.prName AS name
      FROM products p
      JOIN category ca ON p.caID = ca.caID
      JOIN color c ON p.coID = c.coID
      JOIN name n ON p.nID = n.nID
      WHERE ca.caName = 'Tech Products' AND n.prName = 'iPhone Case'
    `;
    const [iPhoneCases] = await connection.query(iPhoneCasesQuery);
    const logosQuery = 'SELECT loID, loName FROM logo';
    const [logos] = await connection.query(logosQuery);
    return {iPhoneCases, logos};
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Hoodies
async function getHoodies() {
  let connection;
  try {
    connection = await pool.getConnection();
    const hoodiesQuery = `
      SELECT p.prID, p.prDescription, p.Price, p.Stock, c.coName AS color, n.prName AS name
      FROM products p
      JOIN category ca ON p.caID = ca.caID
      JOIN color c ON p.coID = c.coID
      JOIN name n ON p.nID = n.nID
      WHERE ca.caName = 'Clothing Products' AND n.prName = 'Hoodie'
    `;
    const [hoodies] = await connection.query(hoodiesQuery);
    const logosQuery = 'SELECT loID, loName FROM logo';
    const [logos] = await connection.query(logosQuery);
    return {hoodies, logos};
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// T-Shirts
async function getTShirts() {
  let connection;
  try {
    connection = await pool.getConnection();
    const tShirtsQuery = `
      SELECT p.prID, p.prDescription, p.Price, p.Stock, c.coName AS color, n.prName AS name
      FROM products p
      JOIN category ca ON p.caID = ca.caID
      JOIN color c ON p.coID = c.coID
      JOIN name n ON p.nID = n.nID
      WHERE ca.caName = 'Clothing Products' AND n.prName = 'T-Shirt'
    `;
    const [tShirts] = await connection.query(tShirtsQuery);
    const logosQuery = 'SELECT loID, loName FROM logo';
    const [logos] = await connection.query(logosQuery);
    return {tShirts, logos};
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Checkout
async function processPayment(bID, cardName, cardNumber, expDate, cvv, address, city, state, zip, totalAmount) {
  let connection;
  try {
    connection = await pool.getConnection();
    const orderQuery = `INSERT INTO orders (bID, oDate) VALUES (?, CURDATE())`;
    await connection.query(orderQuery, [bID]);
    const [rows] = await connection.query('SELECT LAST_INSERT_ID() AS oID');
    const oID = rows[0].oID;
    const paymentQuery = `
      INSERT INTO payment (oID, totalAmount, paDate, nameOnCard, cardNumber, expDate, securityNumber, address, city, state, zipcode)
      VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(paymentQuery, [oID, totalAmount, cardName, cardNumber, expDate, cvv,address, city, state, zip]);
    return {success: true, message: 'Payment Processed Successfully!', oID};
  } catch (error) {
    return {success: false, message: 'Error'};
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Insert Into Orders_Products
async function insertOP(oID, prID, loID) {
  const connection = await pool.getConnection();
  try {
    const ordersProductsQuery = `
      INSERT INTO orders_products (oID, prID, loID)
      VALUES (?, ?, ?)
    `;
    await connection.query(ordersProductsQuery, [oID, prID, loID]);
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

// Past Orders
async function getPO(bID) {
  let connection;
  try {
    connection = await pool.getConnection();  

    const ordersQuery = `
      SELECT o.oID, o.oDate, p.prDescription, p.Price, p.Stock, c.coName AS color, n.prName AS productName, lo.loName AS logo
      FROM orders o
      JOIN orders_products op ON o.oID = op.oID
      JOIN products p ON op.prID = p.prID
      JOIN name n ON p.nID = n.nID
      JOIN color c ON p.coID = c.coID
      LEFT JOIN logo lo ON op.loID = lo.loID
      WHERE o.bID = ?
      ORDER BY o.oDate DESC;
    `;
    
    const [orders] = await connection.query(ordersQuery, [bID]);

    return orders;
  } catch (error) {
    console.error('Error fetching past orders:', error);
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

module.exports = {buyerData, insertBuyer, getBuyer, updateBuyer, updatePassword, getLaptopCases, getiPhoneCases, getHoodies, getTShirts, processPayment, insertOP, getPO, getTables};  // Export query function for use in other files