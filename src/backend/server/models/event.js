/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 */

// Import mysql helper
const mysql = require('../helpers/mysql');

module.exports = {
    /**
     * Add event query
     */
    add_event:  async function(id_event, description, place, discretion, reply_type, id_user) {
        try{
            const query = await mysql.query('INSERT INTO events (id_event, evt_desc, evt_place, evt_discretion, evt_reply_type, fk_usr_creator) VALUES (?,?,?,?,?,?)', [id_event, description, place, discretion, reply_type, id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Add event dates query
     */
    add_event_dates: async function(event_dates){
        try{
            const query = await mysql.query('INSERT INTO events_dates (evt_date, fk_evt) VALUES ?', [event_dates]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Get event details query
     */
    get_event_details: async function(event_id){
        try{
            const query = await mysql.query('SELECT id_event, evt_desc, evt_place, evt_discretion, evt_reply_type, id_user, usr_firstname, usr_lastname, usr_email FROM events,users WHERE id_event = ? AND id_user = fk_usr_creator', [event_id]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Get event dates query
     */
    get_event_dates: async function(event_id){
        try{
            const query = await mysql.query('SELECT id_date, evt_date FROM events_dates WHERE fk_evt = ? ORDER BY evt_date ASC', [event_id]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Add a participation (join event) query
     */
    add_participation: async function(participation){
        try{
            const query = await mysql.query('INSERT INTO participations (par_probability, par_reply, fk_usr, fk_evt, fk_date) VALUES ?', [participation]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Updates participation query
     */
    update_participation: async function(probability, reply, id_date, id_participation){
        try{
            const query = await mysql.query('UPDATE participations SET par_probability = ?, par_reply = ?, fk_date = ? WHERE id_participation = ?', [probability, reply, id_date, id_participation]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Get user's created event query
     */
    list_user_created_events: async function(id_user){
        try{
            const query = await mysql.query('SELECT id_event,evt_desc,evt_place,evt_discretion, evt_reply_type, id_user, usr_firstname, usr_lastname, usr_email, IFNULL(COUNT(DISTINCT fk_usr),0) AS participants FROM events LEFT JOIN participations ON fk_evt = id_event LEFT JOIN users ON id_user = fk_usr_creator WHERE fk_usr_creator = ? GROUP BY id_event', [id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Get user participations query
     */
    list_user_participations: async function(id_user){
        try{
            const query = await mysql.query('SELECT id_event,evt_desc,evt_place,evt_discretion, evt_reply_type,id_user AS creator_id,usr_firstname AS creator_firstname,usr_lastname AS creator_lastname, usr_email AS creator_email,evt_date, p.id_participation,p.par_probability,p.par_reply, IFNULL(COUNT(DISTINCT p2.fk_usr),0) AS participants FROM events_dates LEFT JOIN participations AS p ON p.fk_usr = ? LEFT JOIN participations AS p2 ON p2.fk_evt = p.fk_evt LEFT JOIN events ON id_event = p.fk_evt LEFT JOIN users ON id_user = events.fk_usr_creator WHERE id_date = p.fk_date GROUP BY p.id_participation', [id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * List participants and participation details by event id query
     */
    list_event_participants: async function(event_id,id_user){
        try{
            const query = await mysql.query('SELECT id_participation, id_user, usr_firstname, usr_lastname, usr_email, usr_phone, par_probability, par_reply, evt_date, id_date FROM users,participations,events_dates WHERE participations.fk_evt = ? AND id_date = fk_date AND '+(id_user !== null ? ' id_user = ? AND '  : '') +'fk_usr = id_user', (id_user !== null ? [event_id,id_user] : [event_id]));
            return query;
        }
        catch(error){
            console.log(error);
        }
    },
    /**
     * Get participation details by event id and id user
     */
    get_participation_details: async function(event_id, id_user){
        try{
            const query = await mysql.query('SELECT id_participation, par_probability, par_reply, id_user, usr_firstname, usr_lastname, usr_email, id_date, evt_date FROM users,participations,events_dates WHERE participations.fk_evt = ? AND id_date = fk_date AND fk_usr = ? AND id_user = fk_usr', [event_id, id_user]);
            return query;
        }
        catch(error){
            console.log(error);
        }
    }
}