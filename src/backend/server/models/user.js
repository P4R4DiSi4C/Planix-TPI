/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */

// Import mysql helper
const mysql = require('../helpers/mysql');

module.exports = {
    /**
     * Get user details by id
     */
    get_user_by_id: async function(id_user) {
        try{
            const [rows] = await mysql.query('SELECT * FROM users WHERE id_user = ?', id_user);
            return rows;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Set user's tokens in database
     */
    set_tokens: async function(access_token, refresh_token,id_user)
    {
        try{
            const query = await mysql.query('UPDATE users SET usr_access_token = ?, usr_refresh_token = ? WHERE id_user = ?', [access_token, refresh_token, id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Create user in database
     */
    create_user: async function(new_user){
        try{
            const query = await mysql.query('INSERT INTO users (id_user, usr_firstname, usr_lastname, usr_email, usr_phone, usr_access_token, usr_refresh_token) VALUES ?', [new_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Add sign up information to user in database
     */
    sign_up: async function(firstname, lastname, phone, id_user)
    {
        try{
            const query = await mysql.query('UPDATE users SET usr_firstname = ?, usr_lastname = ?, usr_phone = ? WHERE id_user = ?', [firstname,lastname,phone,id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    }
}