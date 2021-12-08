/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */


// Import helper
const helper = require('../helpers/helper');

// Import models
const event_model = require('../models/event');
const user_model = require('../models/user');

// Import libs
const uuidv4 = require('uuid/v4');

module.exports = {
    /**
     * Add an event with JWT strategy.
     * Only logged users are able to add a new event.
     */
    add_event:  passport => async(req,res,next) => {
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // If user wasn't found in the database, send error response.
            if(!user)
            {
                return helper.login_error(req,res,next);
            }
            try{
                // Get event information from body
                let event_info = req.body;

                // Get a new random id
                let event_id = uuidv4();

                // Add event to database
                let query = await event_model.add_event(event_id, event_info.description, event_info.place, event_info.discretion, event_info.reply_type, user[0].id_user);
                
                // If an error occured during query returns an error
                if(!query){
                    return helper.error_occured();
                }

                // Format a table with datetimes + id event
                let sliced = event_info.datetimes.reduce((r, a) => r.concat(a.date, event_id), []);
                let event_dates = sliced.reduce(function(result, value, index, array) {
                    if (index % 2 === 0)
                        result.push(array.slice(index,index + 2));
                    return result;
                }, []);
                
                // Add event dates
                query = await event_model.add_event_dates(event_dates);
                
                // If an error occured during query returns an error
                if(!query){
                    return helper.error_occured();
                }

                // Returns success if the event has been added
                return res.status(200).json({
                    message : 'Événement créé !',
                    id: event_id
                }); 
            }
            catch(error){
                console.log(error);
                return helper.error_occured();
            }
            
        })(req,res,next)
    },
    /**
     * Add a participation.
     * Logged and unlogged users can join an event
     */
    join_event:  passport => async(req,res,next) => {
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            try{
                // Set user id to null
                let user_id = null;

                // Set json response to success
                let json_response = {
                    message : 'Participation ajoutée'
                };

                // If user object is empty
                if(!user)
                {
                    // Get a new random id
                    let random_id = uuidv4();

                    // Set new user object with the random id
                    let new_user = [
                        [
                            random_id,
                            null,
                            null,
                            null,
                            null,
                            null,
                            null
                        ]
                    ];

                    // Create the new user
                    let query = await user_model.create_user(new_user);

                    // If an error occured while adding the new user returns an error
                    if(!query){
                        return helper.error_occured();
                    }

                    // Set the user_id var to the user id
                    user_id = random_id;

                    // Add the new user's token to the response
                    json_response.token=helper.sign_token(user_id,process.env.JWT_EXP_SIGNIN_ANON);
                }
                else
                {
                    // If user object is set, set user_id var to his id
                    user_id = user[0].id_user;
                }

                // Get participation details from body
                let data = req.body;

                // Check if participation id is set
                if(data.id_participation != '')
                {
                    // Updates the participation with new details
                    query = await event_model.update_participation(
                        (data.probability === '' ? null : data.probability),
                        (data.reply === '' ? null : data.reply),
                        data.date,
                        data.id_participation);

                    // Sets the response message to participation updated
                    json_response.message = 'Participation mise à jour';
                }
                else{
                    // Set a new participation object with details from body
                    let participation = [
                        [
                            (data.probability === '' ? null : data.probability),
                            (data.reply === '' ? null : data.reply),
                            user_id,
                            data.event,
                            data.date                        
                        ]
                    ] 
                    // Adds the new participation
                    query = await event_model.add_participation(participation);
                }
                
                // If an error occured while adding or updating the participation return an error
                if(!query){
                    return helper.error_occured();
                }

                // Return the final response
                return res.status(200).json(json_response); 
            }
            catch(error){
                console.log(error);
                return helper.error_occured();
            }
            
        })(req,res,next)
    },
    /**
     * Get event_details
     * Any user can get details about an event
     */
    get_event_details: async(req,res,next) => {            
        try{
            // Get the event id from params url
            let event_id = req.params.id;

            // Get event details by id
            let event_details = await event_model.get_event_details(event_id);
                    
            // If an error occured while gettig the details of the event return an error
            if(!event_details){
                return helper.error_occured();
            }

            // Check if event was found, if not returns error
            if(!event_details[0].length)
            {
                return res.status(400).json({
                    message : 'Événement pas trouvé !'
                });
            }

            // Get event dates
            let event_dates = await event_model.get_event_dates(event_id);

            // If an error occured while getting the event dates returns an error
            if(!event_dates){
                return helper.error_occured();
            }

            // Check if event has dates
            if(!event_dates[0].length)
            {
                return res.status(400).json({
                    message : 'Pas de dates trouvées'
                });
            }
            
            // Format the result to have an array of details and array of dates
            event_details = event_details[0][0];
            event_dates = event_dates[0];

            return res.status(200).json({
                event_details,
                event_dates
            }); 
        }
        catch(error){
            console.log(error);
            return helper.error_occured();
        }
    },
    /**
     * Get created event by user
     */
    get_created_events:   passport => async(req,res,next) => {
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // If user not found on database returns an error
            if(!user)
            {
                return helper.login_error(req,res,next);
            }

            // Get created users by user id
            let created_events = await event_model.list_user_created_events(user[0].id_user);
                    
            // Check if an error occured while getting the events and return an error
            if(!created_events){
                return helper.error_occured();
            }

            // Check if created events isn't empty
            if(!created_events[0].length)
            {
                return res.status(400).json({
                    message : 'Pas d\'événemets créés'
                });
            }

            // Format table and return results
            created_events = created_events[0];

            return res.status(200).json({
                created_events
            });
        })(req,res,next)
    },
    /**
     * Get user participations
     */
    get_participations:   passport => async(req,res,next) => {
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // If user not found on database returns an error
            if(!user)
            {
                return helper.login_error(req,res,next);
            }

            // Get user's participations
            let user_participations = await event_model.list_user_participations(user[0].id_user);
                    
            // Check if an error occured while getting the events and return an error
            if(!user_participations){
                return helper.error_occured();
            }

            // Check if user participations isn't empty
            if(!user_participations[0].length)
            {
                return res.status(400).json({
                    message : 'Pas de participations'
                });
            }

            // Format array and return resulsts
            user_participations = user_participations[0];

            return res.status(200).json({
                user_participations
            }); 
        })(req,res,next)
    },
    /**
     * Get event participants and details
     */
    get_event_participants: passport => async(req,res,next) => { 
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            try{
                // Get event id by req params
                let event_id = req.params.id;

                // Set id_user to null
                let id_user = null;

                // Set event participants to empty array
                let event_participants = [];

                // Check if user is set and set id_user var
                if(user)
                    id_user = user[0].id_user;

                // Get event details by id
                let event_details = await event_model.get_event_details(event_id);
                
                // Check if event isn't discretion or if event creator ID is the one authentified on the request
                if(event_details[0][0].evt_discretion === 0 || event_details[0][0].id_user === id_user)
                {
                    // Get ALL event participation
                    event_participants = await event_model.list_event_participants(event_id,null);
                }
                // If user_id is set
                else if(id_user !== null)
                {
                    // Get user participations on that event
                    event_participants = await event_model.list_event_participants(event_id,id_user);
                }
                else{
                    // Return error if not any of the cases above
                    return res.status(400).json({
                        message : 'Pas autorisé'
                    });
                }

                // If an error occured while getting participants return an error
                if(!event_participants){
                    return helper.error_occured();
                }

                // If participants array is empty
                if(!event_participants[0].length)
                {
                    return res.status(400).json({
                        message : 'Pas de participants'
                    });
                }

                // Format array and return results
                event_participants = event_participants[0];

                return res.status(200).json({
                    event_participants
                }); 
            }
            catch(error)
            {
                console.log(error);
                return helper.error_occured();
            }
        })(req,res,next)
    },
    /**
     * Get user details on event
     */
    get_event_user_details: passport => async(req,res,next) => {            
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // If user not found on database returns an error
            if(!user)
            {
                return helper.login_error(req,res,next);
            }

            try{
                // Get participation details
                let participation_details = await event_model.get_participation_details(req.params.id,user[0].id_user);
                        
                // If an error occured while getting participation details return an error
                if(!participation_details){
                    return helper.error_occured();
                }

                // Check if participation details isn't empty
                if(!participation_details[0].length)
                {
                    return res.status(400).json({
                        message : 'Pas de participations'
                    });
                }

                // Format array and return results
                participation_details = participation_details[0];

                return res.status(200).json({
                    participation_details
                }); 
            }
            catch(error)
            {
                console.log(error);
                return helper.error_occured();
            }
        })(req,res,next)
    }
}