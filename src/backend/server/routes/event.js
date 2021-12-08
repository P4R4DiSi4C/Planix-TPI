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
const event_controller = require('../controllers/event');

// Import joi config
const {validate_body, schemas} = require('../helpers/data_validation');

// Add event route
router.route('/add')
    .post(validate_body(schemas.event_details),event_controller.add_event(passport));

// Add participation
router.route('/join')
    .post(validate_body(schemas.participation),event_controller.join_event(passport));

// Get event details
router.route('/get/:id')
    .get(event_controller.get_event_details);

// Get participants + details of participations by event id
router.route('/get/participants/:id')
    .get(event_controller.get_event_participants(passport));

// Get user created events
router.route('/user/created')
    .get(event_controller.get_created_events(passport));

// Get user participations
router.route('/user/participations')
    .get(event_controller.get_participations(passport));

// Get user participation details by id participation
router.route('/user/participation/:id')
    .get(event_controller.get_event_user_details(passport)); //TODO VERIF EVENTID

module.exports = router;