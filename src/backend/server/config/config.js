/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Holds the configuraton depending on NODE_ENV var from ".env"
 */

// Configuration for different environments.
const config = {
    // For development purposes
    development:{
        database:{
            host: "p4sqch.net",
            user: "planix_user",
            password: "Crm3a6^4",
            db_name: "planix_db"
        }
    },
    // For testing purposes
    test:{
        database:{
            host: "p4sqch.net",
            user: "planix_user_test",
            password: "wDp5c0!4",
            db_name: "planix_db_test"
        }
    },
    // For production purposes
    production:{
        database:{
            host: "localhost",
            user: "planix_user",
            password: "5fm5m23x",
            db_name: "planix"
        }
    }
}

exports.get = function get(env) {
    return config[env] || config.dev;
}