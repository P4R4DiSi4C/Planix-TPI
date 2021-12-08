/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Main entry point of the backend
 */

// Import application
const app = require('./server/app');

// Start server
const port = process.env.HOST_PORT || 3000;

// Start listening on port 3000
app.listen(port, function(){
    console.log('Server listening on port: ' + port);
});