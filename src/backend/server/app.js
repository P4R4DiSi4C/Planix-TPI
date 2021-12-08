/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Holds the execution of express.js and it's middlewares.
 */

// Load .env
require('dotenv').config()

// Import libraries
const express     = require('express');
const morgan      = require('morgan');
const body_parser = require('body-parser');
const cors        = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const app         = express();

// Set Express middlewares
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(body_parser.json());

// Config
app.set('etag', false);

// Routes
app.use('/user', require('./routes/user'));
app.use('/event', require('./routes/event'));

// Root 
app.get('/', function(req, res) {
    res.status(500).json({
        message : 'nothing here'
    });
});

// Route not found
app.use(function(req, res, next) {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

// Log errors frontend
app.use(function(err, req, res, next) {
    const error_mess = process.env.NODE_ENV === 'development' ? err.message : '';
    const status     = err.status || 500;

    res.status(status).json({
        message: error_message
    });
});


module.exports= app;