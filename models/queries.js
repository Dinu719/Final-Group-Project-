//this file will create an async function in which connection is made and a function with query result is returned
//then export the function
//the call these function in the controller depends on send or recieve get or post

const pool = require('./connectionDB');

async function userData() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query("SELECT * FROM group2");
       
       return results;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

async function insertUser(name, email) {
    const connection = await pool.getConnection();
    try {
        const query = "INSERT INTO user (name, email) VALUES (?, ?)";
        await connection.query(query, [name, email]);
        return true; // Return true if insertion is successful
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error; // Propagate the error
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


module.exports = {userData, insertUser};