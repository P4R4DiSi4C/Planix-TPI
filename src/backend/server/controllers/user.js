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

// Import user model
const user_model = require('../models/user');

// Import googleapis lib
const {google} = require('googleapis');

// Import Google Calendar API
const calendar = google.calendar('v3');

// Google oauth client
const oauth2Client = new google.auth.OAuth2(
    '794639233624-scr67dr9isr9uoa0mj447so56fp6olr9.apps.googleusercontent.com',
    'UdccN19Qzb2Deo03tpgX9xf6',
    'http://'+(process.env.NODE_ENV !== 'production' ? 'localhost:8080' : 'davidcarvalho.xyz')
);

module.exports = {
    /**
     * Google authentification logic
     */
    google_auth: async(req,res,next) => {
        // Get user tokens with oauth2client and the Google authorization code present in: req.body
        await oauth2Client.getToken(req.body.code, async (err, tokens) => {
            // Now tokens contains an access_token and a refresh_token
            if (!err) {
                // Keep tokens in variables
                let {access_token,refresh_token,expiry_date} = tokens;

                // Set oauth2client credentials to this user tokens
                oauth2Client.setCredentials({access_token,refresh_token});

                // Set oauth2 with oauth2client to gather information
                let oauth2 = google.oauth2({
                    auth: oauth2Client,
                    version: 'v2'
                });

                // Get user information from google oauth api
                let userinfo = await oauth2.userinfo.get();

                // Save the Google id and email in variables
                let {id,email} = userinfo.data;

                try{
                    // Try to get the user by his Google ID
                    let user = await user_model.get_user_by_id(id);

                    // Error handling
                    if(!user)
                    {
                        return helper.error_occured();
                    }

                    // If user exists
                    if(user.length)
                    {
                        // Check if user finished the signup process
                        if(user[0].usr_firstname)
                        {
                            // Update access_token and refresh_token
                            let query = await user_model.set_tokens(access_token,refresh_token,id)
                            
                            if(!query){
                                return helper.error_occured();
                            }

                            // Sign user id and send token with status 200
                            return res.status(200).json({
                                message : 'Connexion réussie !',
                                token: helper.sign_token(id,process.env.JWT_EXP_SIGNIN)
                            });
                        }
                    }
                    else
                    {
                        // If user doesn't exist create a new one with empty firstname/lastname/phone
                        let new_user = [
                            [
                                id,
                                null,
                                null,
                                email,
                                null,
                                access_token,
                                refresh_token
                            ]
                        ];
                        
                        // Create the user
                        let query = await user_model.create_user(new_user);
    
                        // Error handler
                        if(!query){
                            return helper.error_occured();
                        }
                    }

                    // Sign user id and send token with status 400 and message "SIGN_UP"
                    return res.status(400).json({
                        message : 'SIGN_UP',
                        token: helper.sign_token(id,process.env.JWT_EXP_SIGNUP)
                    });
                }
                catch(error){
                    console.log(error);
                    return helper.error_occured();
                }
            }
            else{
                console.log(err);
                return res.status(400).json({
                    message : err.response.data
                });
            }
        });
    },
    /**
     * Extra sign_up logic
     */
    sign_up: passport => async(req,res,next) => {            
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // Check if user exists
            if(!user)
            {
                return helper.login_error(req,res,next);
            }
            
            try{
                // Get user info from body
                const user_info = req.body;

                // Sign up user
                let query = await user_model.sign_up(user_info.firstname, user_info.lastname, (user_info.phone === '' ? null : user_info.phone ), user[0].id_user);
                
                if(!query){
                    return helper.error_occured();
                }

                //Response with token
                return res.status(200).json({
                    message : 'Inscription réussie',
                    token: helper.sign_token(user[0].id_user,process.env.JWT_EXP_SIGNIN)
                });  
            }
            catch(error){
                console.log(error);
                return helper.error_occured();
            }
        })(req,res,next)
    },
    /**
     * Google Calendar integration
     */
    get_calendar: passport => async(req,res,next) => {            
        await passport.authenticate('jwt', {session: false}, async function(err, user, info)
        {
            // Check if user exists
            if(!user)
            {
                return helper.login_error(req,res,next);
            }

            // Store acces_token and refresh_token
            let access_token = user[0].usr_access_token;
            let refresh_token = user[0].usr_refresh_token;

            // Get min date and max date from request body
            let {date_min,date_max} = req.body;

            // Check if users has both Google tokens
            if(!access_token || !refresh_token)
            {
                return res.status(401).json({
                    message : 'Connexion Google manquante !' 
                });
            }

            // Set oauth credentials to user credentials 
            // to automatically refresh the access_token if expired
            oauth2Client.setCredentials({
                access_token,
                refresh_token
            })
            
            try{               
                // List events betweend min date and max date
                const res_cal = await calendar.events.list
                (
                    {
                        calendarId:'primary',
                        auth:oauth2Client,
                        maxResults:10,
                        showDeleted:false,
                        timeMin:date_min,
                        timeMax:date_max,
                        singleEvents:true,
                        showDeleted: false,
                        orderBy:"startTime"
                });

                // Order events by startdate desc by using reverse.
                let events = res_cal.data.items.map(obj => { 
                    var rObj = {};
                    rObj['id'] = obj.id;
                    rObj['summary'] = obj.summary; 
                    rObj['status'] = obj.status; 
                    rObj['location'] = (obj.location ? obj.location : obj.description ); 
                    rObj['creator'] = obj.creator.displayName; 
                    rObj['organizer'] = obj.organizer.displayName; 
                    rObj['start'] = (obj.start.dateTime ? obj.start.dateTime : obj.start.date ); 
                    rObj['end'] = (obj.end.dateTime ? obj.end.dateTime : obj.end.date); 
                    return rObj;
                }).reverse();

                // Check if an event has been found
                if(events.length < 1)
                {
                    return res.status(400).json({
                        message: "Pas d'événements Google planifiés"
                    });
                }                     

                // Return events
                return res.status(200).json({
                    events
                });
            }
            catch(error)
            {
                console.log(error);
            }

        })(req,res,next)
    }
}