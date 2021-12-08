/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Helper file containing useful methods
 */

// Import JWT Lib
const JWT = require('jsonwebtoken');

module.exports = {
    /**
     * Sign a token using jsonwebtoken library and specified userid + exp
     */
    sign_token: (id_user,exp) => {
        return JWT.sign({
            iss: 'Planix-backend',
            sub: id_user
        },process.env.JWT_SECRET,{ expiresIn: String(exp) });
    },
    /**
     * HTTP response when an error occured about session
     */
    login_error: (req,res,next) => {
        res.status(401).json({
            message : 'Erreur de connexion' 
        });
    },
    /**
     * HTTP response when an error occured "general"
     */
    error_occured:() => {
        res.status(400).json({
            message : "Une erreur est survenue"
        });
    }
}

