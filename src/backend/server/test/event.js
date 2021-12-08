/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */

// Set NODE_ENV var to test
process.env.NODE_ENV = 'test';

// Import mysql helper
const mysql = require('../helpers/mysql');

// Import dependencies
const request = require('supertest');
const app = require('../app');
const chai = require('chai');
const expect = chai.expect;

// Store created event id and date id
let id_event = 0;
let id_date = 0;

describe('Events test', function(){    
    before((done) => {
        // Clear test database before starting tests
        try{            
            mysql.query('DELETE FROM events_dates').then(mysql.query('DELETE FROM events')).then(done())           
        }
        catch(error)
        {
            console.log(error)
        }
    });

    //Add event by being logged in
    it('Add event with login => Status = 200', async () => {
        const response = await request(app)
                                    .post('/event/add')
                                    .send({
                                        "description":"UNIT TEST",
                                        "place":"LAUSANNE",
                                        "datetimes":
                                            [
                                                {
                                                    "date":"2018-06-10T12:00:00.000+02:00"
                                                },
                                                {
                                                    "date":"2018-06-10T15:00:00.000+02:00"
                                                }
                                            ],
                                        "discretion":0,
                                        "reply_type":1
                                    })
                                    .set('Content-Type', 'application/json')
                                    .set('Accept', 'application/json')
                                    .set('Authorization', process.env.JWT_USER_TESTS);

        // Store id event and id date for next tests
        id_event = await mysql.query('SELECT id_event FROM events LIMIT 1');
        id_date = await mysql.query('SELECT id_date FROM events_dates LIMIT 1')
        id_event = id_event[0][0].id_event;
        id_date = id_date[0][0].id_date;

        // Check if http status is 200
        expect(response.statusCode).to.equal(200);
    });
       
    //Add participation by being logged in
    it('Add participation with login => Status = 200', async () => {
        const response = await request(app)
                                    .post('/event/join')
                                    .send({
                                        "probability":40,
                                        "reply":"",
                                        "event":id_event,
                                        "date":id_date,
                                        "id_participation":""
                                    })
                                    .set('Content-Type', 'application/json')
                                    .set('Accept', 'application/json')
                                    .set('Authorization', process.env.JWT_USER_TESTS);

        // Check if HTTP code is 200
        expect(response.statusCode).to.equal(200);
    });

    //List user participations by being logged in 
    it('List user participations with login => Status = 200', async () => {
        const response = await request(app)
                                    .get('/event/user/participations')
                                    .set('Content-Type', 'application/json')
                                    .set('Accept', 'application/json')
                                    .set('Authorization', process.env.JWT_USER_TESTS);

        // Check event HTTP code is 200
        expect(response.statusCode).to.equal(200);
    });

    //List event details without being logged in
    it('List event details without login => Status = 200', async () => {
        const response = await request(app)
                                    .get('/event/get/'+id_event)
                                    .set('Content-Type', 'application/json')
                                    .set('Accept', 'application/json');

        // Check if HTTP status code is equal to 200
        expect(response.statusCode).to.equal(200);
    });

    // List user created events by being logged in
    it('List user created events with login => Status = 200', async () => {
        const response = await request(app)
                                    .get('/event/user/created')
                                    .set('Content-Type', 'application/json')
                                    .set('Accept', 'application/json')
                                    .set('Authorization', process.env.JWT_USER_TESTS);

        // Check if HTTP status code is equal to 200
        expect(response.statusCode).to.equal(200);
    });
})