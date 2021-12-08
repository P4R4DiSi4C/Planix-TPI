/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */

// Import Express router
const router = require('express').Router();

// Import pasport + config
const passport = require('passport');
const passportConf = require('../helpers/passport');

// Import event controller
const user_controller = require('../controllers/user');

// Import joi config
const {validate_body, schemas} = require('../helpers/data_validation');

// OAuth authentification with Google
router.route('/oauth/google')
    .post(validate_body(schemas.google_auth_code),user_controller.google_auth);

// Sign up route for extra information
router.route('/sign_up')
    .post(validate_body(schemas.sign_up),user_controller.sign_up(passport));

// Google Calendar integration
router.route('/calendar')
    .post(validate_body(schemas.calendar),user_controller.get_calendar(passport));

module.exports = router;