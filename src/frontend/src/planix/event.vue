<!--
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Event details page
-->
<template>
    <b-container fluid>
        <vue-headful
            title="Planix - Événement"
            description="Détails de l'événement"
        />
        <b-row class="px-3 py-3 pt-md-5 pb-md-4">
            <b-col cols="12" md="4" class="mb-3">
                <b-card class="box-shadow h-100" 
                        title="Détails de l'événement"
                        name="event_details">
                        <b-form-group horizontal label="Description:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{event_details.evt_desc}}</label>
                        </b-form-group>
                        <b-form-group horizontal label="Lieu:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{event_details.evt_place}}</label>
                        </b-form-group>
                        <b-form-group horizontal label="Discrétion:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{(event_details.evt_discretion === 0 ? 'Non' : 'Oui')}}</label>
                        </b-form-group>
                        <b-form-group horizontal label="Mode de réponse:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{(event_details.evt_reply_type === 0 ? 'Réponse' : 'Probabilité')}}</label>
                        </b-form-group>
                        <b-form-group horizontal label="Créateur:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{event_details.usr_firstname + " " + event_details.usr_lastname}}</label>
                        </b-form-group>
                        <b-form-group horizontal label="Contact:" :label-cols="4" label-class="font-weight-bold pt-0">
                            <label style="display:block;">{{event_details.usr_email}}</label>
                        </b-form-group>
                </b-card>
            </b-col>
            <b-col cols="12" md="8" class="mb-3">
                <b-card class="box-shadow h-100" title="Participer">                         
                    <b-card no-body>
                        <b-tabs pills card v-model="tab_index">
                            <b-tab v-for="data in event_dates" v-bind:key="data.id_date" :title="get_evt_date(data.evt_date)" v-on:click="refresh_data()">
                                <template v-if="$moment($moment(new Date())).isBefore($moment(event_dates[0].evt_date))">
                                    <div v-if="event_details.evt_reply_type === 0">
                                        <b-form-group
                                            description="Sélectionnez une réponse"
                                            label="Réponse:"
                                            label-for="select_reply">
                                            <b-form-select id="select_reply" v-model="new_participation.reply" :options="replies" class="mb-3" />
                                        </b-form-group>
                                    </div>
                                    <div v-else>
                                        <b-form-group
                                            description="Sélectionnez la probabilité de venir"
                                            label="Probabilité:">
                                            <vue-slider ref="slider2" v-bind="probability_slider" v-model="new_participation.probability"></vue-slider>
                                        </b-form-group>
                                    </div>
                                    <b-button class="btn-block btn-outline-primary" v-on:click="save_participation">Sauvegarder</b-button>
                                </template>
                                <template v-else>
                                    <h3>Il n'est plus possible de s'inscrire</h3>
                                </template>
                            </b-tab>
                        </b-tabs>
                    </b-card>
                </b-card>
            </b-col>
            
            <b-col cols="12" class="mb-3">
                <b-card class="box-shadow" title="Participations">
                    <div class="table-responsive">
                        <table class="table text-center table-hover table-bordered table-sm">
                            <thead>
                                <tr>
                                    <th class="no-border"></th>
                                    <th class="dark-header" v-for="data in event_dates" v-bind:key="data.id_date">
                                        {{get_evt_date(data.evt_date)}}
                                    </th>
                                </tr>
                                <tr>
                                    <th class="dark-header">Participants</th>
                                    <template v-for="data in event_dates">
                                        <template v-if="event_details.evt_reply_type !== 0">
                                            <th v-bind:key="data.id_date">Probabilités</th>
                                        </template>
                                        <template v-else>
                                            <th v-bind:key="data.id_date">Réponses</th>
                                        </template>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="data in participants_by_id" v-bind:key="data.id_user">
                                    <td>
                                        {{(data[0].usr_firstname != null ? data[0].usr_firstname + ' ' + data[0].usr_lastname : 'Anon')}}
                                    </td>
                                    <template v-for="date in event_dates">
                                        <template v-if="date_not_in_participation(date.id_date,data)">
                                            <td></td>
                                        </template>
                                        <template v-else>
                                            <template v-for="participation in data">
                                                <template v-if="date.id_date === participation.id_date">
                                                    <template v-if="event_details.evt_reply_type !== 0">
                                                        <td v-bind:key="participation.id_participation">{{participation.par_probability}}%</td>
                                                    </template>
                                                    <template v-else>
                                                        <td v-bind:key="participation.id_participation">{{participation.par_reply}}</td>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                    </template>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th class="dark-header">Résultats</th>
                                    <template v-if="event_details.evt_reply_type !== 0">
                                        <th :class="{'table-success':event.biggest === true}" v-for="event in probabilities_by_dates" v-bind:key="event.id_date">
                                            {{event.percentage}}%
                                        </th>
                                    </template>
                                    <template v-else>
                                        <th :class="{'table-success':event.biggest === true}" v-for="event in replies_by_dates" v-bind:key="event.id_date">
                                            {{event.percentage}}%
                                        </th>
                                    </template>
                                </tr>
                            </tfoot>
                        </table>   
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
// Import slider component
import vueSlider from 'vue-slider-component';

// Import shared methods
import shared from '../helpers/shared_methods.js';

export default {
    data(){
        return{
            error: '',
            event_details: [],
            event_dates:[],
            event_user_participations:[],
            event_participants:[],
            event_id:'',
            tab_index:0,
            test:0,
            new_participation:{
                reply:'',
                probability: '',
                id_participation: ''
            },
            replies: [
                { value: 'Oui', text: 'Oui' },
                { value: 'Ok si majorité', text: 'Ok si majorité' },
                { value: 'Peut-être', text: 'Peut-être' },
                { value: 'Non', text: 'Non'}
            ],
            probability_slider:{
                tooltip: "hover",
                dotSize: 20,
                lazy: true,
                interval: 10,
                height: 20,
                tooltipDir: [
                    "bottom",
                    "top"
                ],
                bgStyle: {
                    "backgroundColor": "#fff",
                    "boxShadow": "inset 0.5px 0.5px 3px 1px rgba(0,0,0,.36)"
                },
                sliderStyle: [
                    {
                        "backgroundColor": "#f05b72"
                    },
                    {
                        "backgroundColor": "#3498db"
                    }
                ],
                tooltipStyle: [
                    {
                        "backgroundColor": "#f05b72",
                        "borderColor": "#f05b72"
                    },
                    {
                        "backgroundColor": "#3498db",
                        "borderColor": "#3498db"
                    }
                ],
                processStyle: {
                    "backgroundImage": "-webkit-linear-gradient(left, #f05b72, #3498db)"
                }
            }
        };
    },
    components:{
        vueSlider
    },
    /**
     * Fix for slider
     */
    updated(){
        this.$nextTick(() => this.refresh_slider());
    },
    /**
     * On created lifecycle hook event
     */
    async created(){   
        // Set event_id based on route
        this.event_id = this.$route.params.id;

        // Get event details
        await this.get_event_details(); 

        // Get participants
        await this.get_participants();

        // Set default reply,probability and participation
        this.set_defaults();  

        // Participation has to be able to override "default" values so placed after
        await this.get_event_participation();

        // Fix for the slider
        this.$nextTick(() => this.refresh_slider());
    },
    /**
     * Computed variables
     */
    computed: {
        /**
         * Format participants array to get an array by id
         */
        participants_by_id: function(){
            // Return a formated event 
            return this.event_participants.reduce((prev, t, index, arr) => {
                if (typeof prev[t.id_user] === 'undefined') {
                    prev[t.id_user] = [];
                }

                // Push array data to index by id
                prev[t.id_user].push(t);
            return prev;
            }, {});
        },
        /**
         * Format particpants array to get probability by date
         */
        probabilities_by_dates: function(){
            let events = [];
            // Get number of participants
            let participants = Object.keys(this.participants_by_id).length;

            // Check that participants array isn't empty
            if(participants > 0){
                // Loop event dates
                for(let i=0;i < this.event_dates.length;i++)
                {
                    // Set prob to 0
                    let prob = 0;

                    // Loop participants
                    for(let j=0;j<this.event_participants.length;j++){
                        // Check if user participation date is the same as the looped date
                        if(this.event_participants[j].id_date === this.event_dates[i].id_date)
                        {
                            // Increase probability by value entered by user
                            prob += (isNaN(this.event_participants[j].par_probability) ? 0 : this.event_participants[j].par_probability);
                        }
                    }
                    
                    // If no index available create an empty index
                    if (typeof events[i] === 'undefined') {
                        events[i] = [];
                    }

                    // Set values
                    events[i]['id_date'] = this.event_dates[i].id_date;
                    events[i]['percentage'] = prob/participants;
                    events[i]['biggest'] = false;
                }

                // Get index of the highest probability date
                let max = -Infinity;
                let key; 

                events.forEach(function (v, k) { 
                    if (max < +v.percentage) { 
                        max = +v.percentage; 
                        key = k; 
                    }
                });

                // Set biggest value to true for the biggest percentage event
                events[key].biggest = true;

                return events;
            }
        },
        /**
         * Get replies by date
         */
        replies_by_dates: function(){
            let events = [];

            // Count number of participants
            let participants = Object.keys(this.participants_by_id).length;

            // Check if participants array isn't empty
            if(participants > 0){
                // Loop event dates
                for(let i=0;i < this.event_dates.length;i++)
                {
                    // Create index if array isn't set
                    if (typeof events[i] === 'undefined') {
                        events[i] = [];
                    }

                    // Set event values to default values
                    events[i]['id_date'] = this.event_dates[i].id_date;
                    events[i][0] = 0;
                    events[i][1] = 0;
                    events[i][2] = 0;
                    events[i][3] = 0;
                    events[i]['biggest'] = false;
                    events[i]['percentage'] = 0;

                    // Loop participants
                    for(let j=0;j<this.event_participants.length;j++){
                        // Check participation date is equal to the date looped
                        if(this.event_participants[j].id_date === this.event_dates[i].id_date)
                        {
                            // Switch case for each reply increment
                            switch(this.event_participants[j].par_reply){
                                case 'Oui':
                                    events[i][0]++;
                                    break;
                                case 'Ok si majorité':
                                    events[i][1]++;
                                    break;

                                case 'Peut-être':
                                    events[i][2]++;
                                    break;
                                
                                case 'Non':
                                    events[i][3]++;
                                    break;
                            }
                        }
                    }
                }

                // Get the id of the date with the biggest percentage
                let max = -Infinity;
                let key; 

                events.forEach(function (v, k) {     
                    // Store total votes, positives votes, unsure and get percentage
                    let total_votes = (v[0]+v[2]);
                    let positive_votes = v[0]*100/total_votes;
                    let unsure_votes = v[2]*50/total_votes;
                    let percentage = positive_votes + unsure_votes;
                    if(!isNaN(percentage))
                    {
                        v.percentage = percentage;

                        if (max < percentage)
                        { 
                            max = percentage;
                            key = k; 
                        }
                    }
                });

                // Set biggest value to true
                events[key].biggest = true;

                return events;
            }
        }
    },
    methods: {
        /**
         * Store get event date method from shared methods
         */
        get_evt_date: shared.get_evt_date,
        /**
         * Fix for the refresh slider
         */
        refresh_slider:function(){
            // This is a fix for the slider because it's a child of container 
            if(this.$refs.slider2 && this.event_details.evt_reply_type !== 0)
            {
                for(let i=0;i < this.$refs.slider2.length;i++)
                {
                    this.$refs.slider2[i].refresh();
                }
            }
        },
        /**
         * Check if date is in the array
         */
        date_not_in_participation: function(date,data){
            for(let i = 0; i < data.length;i++){    
                // If date is found return false            
                if(data[i].id_date === date){
                    return false;
                }
            }
            return true;        
        },
        /**
         * Get the details of the event
         */
        get_event_details: async function(){
            try{
                let response = await this.$http.get(this.$url+'/event/get/' + this.event_id);   

                this.event_details = response.data.event_details;
                this.event_dates = response.data.event_dates;
                
            }
            catch(error){
                if(error.response){
                    shared.notification('top','center','warning',error.response.data.message,'');
                }
                else{
                    console.log(error);
                }
            }
        },
        /**
         * Get the list of participations
         */
        get_participants: async function(){
            try{
                let response;
                
                // If event is discretion some check have to be made
                if(this.event_details.evt_discretion !== 0){
                    // If no token available, never show participants
                    if(!localStorage.getItem('token') && !this.$cookie.get('token_anon'))
                    {
                        return;
                    }
                    else{
                        // Send request with token embedded
                        let token = this.get_token();

                        response = await this.$http.get(this.$url+'/event/get/participants/' + this.event_id,
                        {
                            headers:{
                                'Authorization': token
                            }
                        }); 
                    }
                         
                }
                else
                {
                    // If event isn't descrtion display all participants
                    response = await this.$http.get(this.$url+'/event/get/participants/' + this.event_id);   
                }

                this.event_participants = response.data.event_participants;   
            }
            catch(error){
                if(error.response){
                    // SWAL ?                         
                }
                else{
                    console.log(error);
                }
            }
        },
        /**
         * Get event participations by user
         */
        get_event_participation: async function(){            
            if(localStorage.getItem('token') || this.$cookie.get('token_anon'))
            {
                try{
                    let response = await this.$http.get(this.$url+'/event/user/participation/' + this.event_id,
                    {
                        headers:{
                            'Authorization': this.get_token()
                        }
                    });      

                    this.event_user_participations = response.data.participation_details;
                    this.get_participants();
                    this.refresh_data();
                }
                catch(error){
                    if(error.response){
                        // SWAL ?              
                    }
                    else{
                        console.log(error);
                    }
                }
            }
        },
        /**
         * Check for google calendar events between min date and datet minx
         */
        check_gcal: async function(){
            try{
                // Date min formatted to be 2hours before
                let date_min = this.$moment(this.event_dates[this.tab_index].evt_date).subtract(2, 'hour').format();

                // Date max formatted to be 2hours later
                let date_max = this.$moment(this.event_dates[this.tab_index].evt_date).add(2, 'hour').format();

                // Request google calendar events between those dates
                let response = await this.$http.post(this.$url+'/user/calendar',
                {
                    date_min,
                    date_max
                },
                {
                    headers:
                    {
                        'Authorization': localStorage.getItem('token')
                    }
                });

                return response.data.events;
            }
            catch(error){
                if(error.response){
                    // SWAL ? 
                }
                else
                {
                    console.log(error);
                }
            }
        },
        /**
         * Save / update participation
         */
        save_participation: async function(){ 
            // Set default variables
            let token;
            let events;
            let confirmed = true;

            // If a participation is saved, check Google Calendar
            if(localStorage.getItem('token'))
            {
                // Get Google Calendar events
                events = await this.check_gcal();
                // Store token
                token = localStorage.getItem('token');
            }
            else{
                // Get token
                token = this.get_token();
            }

            try{
                // If events is set, open a modal to confirm add or cancel
                if(events)
                {
                    confirmed = await shared.gcal_modal(true,events);
                }

                // If unconfirmed cancel
                if(!confirmed)
                    return;

                let response = await this.$http.post(this.$url+'/event/join',
                {
                    probability: this.new_participation.probability,
                    reply: this.new_participation.reply,
                    event: this.event_id,                    
                    date: this.event_dates[this.tab_index].id_date,
                    id_participation: this.new_participation.id_participation
                },
                {
                    headers:{
                        'Authorization': token
                    }
                });

                // If token is set and no JWT token is save on the browser
                if(response.data.token && !(localStorage.getItem('token')))
                {
                    // Set the received token to a cookie for the anonymous user
                    this.$cookie.set('token_anon',response.data.token, { expires: '1Y' })
                }

                // Open a notification with success message
                shared.notification('top','center','success',response.data.message,'');

                // Get user participations of the user
                await this.get_event_participation();
            }
            catch(error){
                if(error.response){
                    shared.notification('top','center','warning',error.response.data.message,'');
                }
                else
                {
                    console.log(error);
                }
            }
        },
        /**
         * Function to get the token from the browser
         */
        get_token: function(){
            // Set token to undefined by default
            let token = undefined;

            // Check and get the JWT token from the browser
            if(localStorage.getItem('token')){
                token = localStorage.getItem('token');
            }
            // Check and get anonymous JWT token from the cookie
            else if(this.$cookie.get('token_anon'))
            {
                token = this.$cookie.get('token_anon');
            }

            return token;
        },
        /**
         * When user open a new tab date refrehs data 
         */
        refresh_data:function(){
            // Get date from event dates array
            let date= this.event_dates[this.tab_index].id_date;

            // Loop user's event participations
            for(let i=0;i<this.event_user_participations.length;i++){
                // Check if date of the tab is the currently looped date of participations
                if(this.event_user_participations[i].id_date == date){
                    
                    // If event reply mode is by replies, store user reply to new_participation array
                    if(this.event_details.evt_reply_type === 0)
                    {
                        this.new_participation.reply = this.event_user_participations[i].par_reply;
                    }
                    // If event reply is probability, set user probability for that date
                    else{
                        this.new_participation.probability = this.event_user_participations[i].par_probability;
                    }
                    
                    // Set id participation of the new participation to user participation id if set
                    this.new_participation.id_participation = this.event_user_participations[i].id_participation;

                    return;
                }
            }

            // Set defaults values
            this.set_defaults();
        },
        /**
         * Set defaults values of new participation array
         */
        set_defaults: function(){
            // If reply mode is by replies, set "Oui" by default
            if(this.event_details.evt_reply_type === 0)
                this.new_participation.reply = 'Oui';
            else
            {
                // If reply mode isn't by reply, set probability to 0
                this.new_participation.probability = 0;
            }

            // Empty participation id
            this.new_participation.id_participation = '';
        }
    }
}
</script>
<style scoped>
td {
    vertical-align : middle;
}

.dark-header{
    color:white;
    background-color:#000000ad;
}

.no-border{
    border: 0;
}

.container-fluid{
    margin-bottom: 5rem;
}
</style>