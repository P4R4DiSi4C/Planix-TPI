/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Handles JOI Schemas for HTTP body requests validation
 */

// Import library joi
const Joi = require('joi');

module.exports = {
    /**
     * Set schemas based on body fields
     */
    schemas: {
        // Schema for Google authentification
        google_auth_code: Joi.object().keys({
            code: Joi.string().min(30).max(150)
        }),
        // Schema when event is added
        event_details: Joi.object().keys({
            description: Joi.string().min(2).max(60),
            place: Joi.string().min(2).max(50),
            datetimes: Joi.array().min(1).items(
                Joi.object().keys({
                    date: Joi.date()
                })
            ),
            discretion: Joi.number().integer().min(0).max(1),
            reply_type: Joi.number().integer().min(0).max(1)            
        }),
        // Schema when someone joins an event
        participation: Joi.object().keys({
            probability: Joi.number().integer().min(0).max(100).allow(''),
            reply: Joi.string().allow('','Oui','Ok si majorité','Peut-être','Non'),
            event: Joi.string().min(30).max(255).allow(''),
            date: Joi.number().integer(),
            id_participation:Joi.number().integer().allow('')
        }),
        // Schema for sign up fields
        sign_up: Joi.object().keys({
            firstname:  Joi.string().min(2).max(30),
            lastname: Joi.string().min(2).max(30),
            phone: Joi.string().allow('')
        }),
        // Schema for Google Calendar integration
        calendar: Joi.object().keys({
            date_min: Joi.date().iso(),
            date_max: Joi.date().iso()
        })
    },
    /**
     * Validation logic
     */
    validate_body: (schema) => 
    {
        return (req, res, next) => 
        {
            // Set error and value variables from joi validation
            let { error, value } = Joi.validate(req.body, schema)

            // If an error has been found
            if (error) {
                // Returns appropriated error
                switch (error.details[0].context.key) {  
                    case 'code':
                        res.status(400).json({
                            error:'You must provide a valid Google auth code.'
                        })
                    break; 

                    case 'firstname':
                        res.status(400).json({
                            error:'You must provide a valid firstname.'
                        })
                    break;

                    case 'lastname':
                        res.status(400).json({
                            error:'You must provide a valid lastname.'
                        })
                    break;

                    case 'phone':
                        res.status(400).json({
                            error:'You must provide a valid phone number.'
                        })
                    break;

                    case 'description':
                        res.status(400).json({
                            error:'You must provide a valid description.'
                        })
                    break;

                    case 'place':
                        res.status(400).json({
                            error:'You must provide a valid place.'
                        })
                    break;

                    case 'datetimes':
                        res.status(400).json({
                            error:'You must provide atleast 1 date and valid.'
                        })
                    break;

                    case 'option':
                        res.status(400).json({
                            error:'You must provide a valid option. (1 or 2)'
                        })
                    break;
                    
                    default:
                        res.status(400).json({
                            error: error.details[0]
                        })
                }
            } else {
                // Continue logic
                next()
            }
        }
    }
}