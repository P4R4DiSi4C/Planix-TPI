/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */

// Import NODE_ENV config
const config = require('../config/config.js').get(process.env.NODE_ENV);

// Import MySQL2 lib
const mysql = require('mysql2/promise');

// Default max connections 151
// Define connection object with config variables
const connection = mysql.createPool({
    connectionLimit: 50, 
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.db_name,
    //debug: ['ComQueryPacket', 'RowDataPacket']
});

module.exports = {
    // Define execute function
    execute: async (query, parameters) => {
        return await connection.execute(query, parameters);
    },

    // Define query function
    query: async(query,parameters) => {
        return await connection.query(query, parameters);
    }
};