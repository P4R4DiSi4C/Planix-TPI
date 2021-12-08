/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Passport.js library config file with strategies
 */


// Import passport.js
const passport = require('passport');

// Import JWT Strategy
const JwtStrategy = require('passport-jwt').Strategy;

// Import ExtractJwt method to extract token from the header of the request
const { ExtractJwt } = require('passport-jwt');

// Import user model to check wether the user is registered or not
const User = require('../models/user');

// JSON WEB TOKENS STRAT
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'), // Get JWT token from header
    secretOrKey: process.env.JWT_SECRET // Uses secret hash to decrypt
}, async(payload,done) => {
    try{
        //Find user's specified in token
        let user = await User.get_user_by_id(payload.sub);
       
        //Error handler
        if(!user)
        {
            return done(null,false);
        }

        //If user not exists
        if(!user.length)
        {
            return done(null,false);
        }

        // Otherwise return user
        done(null,user);

    }catch(error){
        done(error,false);
    }
}))