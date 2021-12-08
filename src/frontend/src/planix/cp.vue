<!--
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Control panel page
-->
<template>
    <b-container fluid>
        <vue-headful
            title="Planix - Centre de contrôle"
            description="Centre de contrôle de Planix"
        />
        <b-row class="px-3 py-3 pt-md-5 pb-md-4">
            <b-col cols="12" md="4">
                <h2 class="d-flex">Centre de contrôle</h2>
            </b-col>
            <b-col cols="12" md="3" sm="10" offset-md="5" offset-sm="2">
                <b-button style="border-radius: 5rem;" class="float-md-right btn-outline-primary" v-on:click="modals.add_event.opened = true">
                    Créer un événement
                </b-button>
            </b-col>
            <b-col cols="12">
                <h4 class="d-flex">Mes événements</h4>   
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Lieu</th>
                                <th>Discretion</th>
                                <th>Mode réponse</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="data in user_events" v-bind:key="data.id_event">
                                <td><router-link :to="{ name: 'Event', params: { id: data.id_event }}">{{data.evt_desc}}</router-link></td>
                                <td>{{data.evt_place}}</td>
                                <td>{{(data.evt_discretion === 0 ? 'Non' : 'Oui')}}</td>
                                <td>{{(data.evt_reply_type === 0 ? 'Réponse' : 'Probabilité')}}</td>
                                <td>{{data.participants}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-col>
            <b-col cols="12">            
                <h4 class="d-flex">Mes participations</h4>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Lieu</th>
                                <th>Discretion</th>
                                <th>Mode réponse</th>
                                <th>Créé par</th>
                                <th>Date</th>
                                <th>Probabilité</th>
                                <th>Réponse</th>
                                <th>Participants</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="data in user_participations" v-bind:key="data.id_participation">
                                <td><router-link :to="{ name: 'Event', params: { id: data.id_event }}">{{data.evt_desc}}</router-link></td>
                                <td>{{data.evt_place}}</td>
                                <td>{{(data.evt_discretion === 0 ? 'Non' : 'Oui')}}</td>
                                <td>{{(data.evt_reply_type === 0 ? 'Réponse' : 'Probabilité')}}</td>
                                <td>{{(data.creator_firstname != null ? data.creator_firstname + ' ' + data.creator_lastname : 'Anon')}}</td>
                                <td>{{data.evt_date | moment("dddd Do MMMM YYYY [à] hh[h]mm")}}</td>
                                <td>{{(data.par_probability != null ? data.par_probability + "%" : '-')}}</td>
                                <td>{{(data.par_reply != null ? data.par_reply : '-')}}</td>                                
                                <td>{{data.participants}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </b-col>
            
        </b-row>
        <b-modal id="add_event_modal" @hidden="on_modal_hide" no-enforce-focus v-model="modals.add_event.opened" centered hide-footer title="Créer un événement">
            <b-row v-if="modals.add_event.evt_id == ''">
                <b-col cols="12">  
                    <b-form-group>
                        <b-form-input
                                    type="text"
                                    v-model="modals.add_event.evt_desc"
                                    required
                                    placeholder="Description de l'événement">
                        </b-form-input>
                    </b-form-group>
                </b-col>
                <b-col cols="12">  
                    <b-form-group>
                        <b-form-input
                                    type="text"
                                    v-model="modals.add_event.evt_place"
                                    required
                                    placeholder="Lieu de l'événement">
                        </b-form-input>
                    </b-form-group>
                </b-col> 
                <b-col cols="12">
                    <b-form-group>
                        <b-input-group style="margin-bottom: 1rem;" v-for="(input, index) in modals.add_event.evt_dates" v-bind:key="input.id">
                            <datetime class="date"
                                    type="datetime" 
                                    v-model="input.date"
                                    placeholder="Date"
                                    input-class="form-control"
                                    value-zone="UTC+2"
                                    :phrases="{ok: 'Valider', cancel: 'Annuler'}"
                                    :minute-step="5"
                                    :auto="true"
                                    :min-datetime="tomorrow_date"
                                    @input="datetime_changed"
                                    >
                            </datetime>
                            <b-input-group-append v-if="modals.add_event.evt_dates.length > 1">
                                <b-button size="sm" variant="danger" v-on:click="remove_date_field(index)">Supprimer</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col cols="12" style="margin-bottom: 1rem;">
                    <b-button style="border-radius: 5rem;" size="sm" class="d-flex btn-outline-primary" v-on:click="add_date_field">
                        Ajouter une date...
                    </b-button>
                </b-col>
                <b-col cols="12">
                    <b-form-group horizontal label-class="pt-0" :label-cols="4" label="Discrétion:"
                            label-for="discretion_group">
                        <b-form-radio-group id="discretion_group" v-model="modals.add_event.evt_discretion">
                            <b-form-radio value=1>Oui</b-form-radio>
                            <b-form-radio value=0>Non</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                    <b-form-group horizontal label-class="pt-0" :label-cols="4" label="Mode de réponse:"
                            label-for="reply_type">
                        <b-form-radio-group id="reply_type" v-model="modals.add_event.evt_reply_type">
                            <b-form-radio value=0>Réponses</b-form-radio>
                            <b-form-radio value=1>Pourcentage</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </b-col>
                <b-col cols=12>
                    <b-button class="btn-block btn-outline-primary" v-on:click="add_event">Créer l'événement</b-button>
                </b-col>
            </b-row>
            <b-row v-if="modals.add_event.evt_id != ''">
                <b-col cols="12"> 
                    <b-form-group>
                        <b-input-group>
                            <b-form-input
                                    type="text"
                                    :value="hostname + 'event/' + modals.add_event.evt_id"
                                    readonly>
                            </b-form-input>
                            <b-input-group-append>
                                <b-button class="btn-outline-primary"
                                    v-clipboard:copy="hostname + 'event/' + modals.add_event.evt_id"
                                    v-clipboard:success="onCopy"
                                    v-clipboard:error="onError">Copier
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
            </b-row>
        </b-modal>
    </b-container>
</template>

<script>
// Import shared methods
import shared from '../helpers/shared_methods.js';

export default {
    data(){
        return{
            error:'',
            user_events:[],
            user_participations:[],
            modals:{
                add_event:{
                    opened: false,
                    evt_desc:'',
                    evt_place:'',
                    evt_discretion:0,
                    evt_reply_type:0,
                    evt_dates:[
                        {
                            date: ''
                        }
                    ],
                    evt_id: ''
                }
            },
            hostname: '',
            tomorrow_date: ''
        };
    },
    created(){
        // Set tomorrow's date
        let current_date = new Date();
        current_date.setDate(current_date.getDate() + 1);
        this.tomorrow_date = current_date.toISOString();

        // Set hostname
        this.hostname = location.protocol + '//' + location.host + '/';

        //Get events from users
        this.get_user_events();

        //Get participations from users
        this.get_user_participations();
    },
    methods: {
        /**
         * Catch when datetime is changed for Google Calendar
         */
        async datetime_changed($event) {
            if($event !== '')
            {
                // Set date min and date max to -2 hours and +2 hours
                let date_min = this.$moment($event).subtract(2, 'hour').format();
                let date_max = this.$moment($event).add(2, 'hour').format();
            
                try{
                    // Check if any Google Event is present between those 2 dates
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

                    // Open alert
                    await shared.gcal_modal(false,response.data.events);
                }
                catch(error){
                    if(error.response){
                        this.error = error.response.data.message;
                    }
                    else
                    {
                        console.log(error);
                    }
                }
            }
        },
        /**
         * Get user events asynchronously
         */
        get_user_events: async function(){
            try{
                // Get events of the user
                let response = await this.$http.get(this.$url+'/event/user/created',
                {
                    headers:
                    {
                        'Authorization': localStorage.getItem('token')
                    }
                });   
                // Set user_events variable to result
                this.user_events = response.data.created_events;
            }
            catch(error){
                if(error.response){
                    // SWAL ?
                    //shared.notification('top','center','warning',error.response.data.message,'');
                }
                else
                {
                    console.log(error);
                }

            }
        },
        /**
         * Get user participations with his JWT token
         */
        get_user_participations: async function(){
            try{
                // Get user participations
                let response = await this.$http.get(this.$url+'/event/user/participations',
                {
                    headers:
                    {
                        'Authorization': localStorage.getItem('token')
                    }
                });   
                this.user_participations = response.data.user_participations;
            }
            catch(error){
                if(error.response){
                    // SWAL ?
                    //shared.notification('top','center','warning',error.response.data.message,'');
                }
                else
                {
                    console.log(error);
                }
            }
        },
        /**
         * Create an event
         */
        add_event: async function()
        {
            try{
                // Create event request
                let response = await this.$http.post(this.$url+'/event/add',
                {
                    description: this.modals.add_event.evt_desc,
                    place: this.modals.add_event.evt_place,
                    datetimes: this.modals.add_event.evt_dates,                    
                    discretion: Number(this.modals.add_event.evt_discretion),
                    reply_type: Number(this.modals.add_event.evt_reply_type)
                },
                {
                    headers:
                    {
                        'Authorization': localStorage.getItem('token')
                    }
                });

                // Get user event
                await this.get_user_events();
                
                // Reset modal fields values
                this.reset_modal_info();

                // Set event id on the modal
                this.modals.add_event.evt_id = response.data.id;

                // Display a notification
                shared.notification('top','center','success',response.data.message,'');
            }
            catch(error){
                if(error.response){
                    // Display notification with error
                    shared.notification('top','center','warning',error.response.data.message,'');
                }
                else
                {
                    console.log(error);
                }

            }
        },
        /**
         * Method to add a date field
         */
        add_date_field: function() {
            // Push a date to the array
            this.modals.add_event.evt_dates.push({
                date: ''
            });
        },
        /**
         * Remove a date field
         */
        remove_date_field: function(index) {
            // Remove index field from array
            this.modals.add_event.evt_dates.splice(index,1);
        },
        /**
         * Reset infromation in the modal fields
         */
        reset_modal_info: function(){
            this.modals.add_event.evt_desc = '';
            this.modals.add_event.evt_place = '';
            this.modals.add_event.evt_discretion = 0;
            this.modals.add_event.evt_reply_type = 0;
            this.modals.add_event.evt_dates = [{date: ''}];
        },
        /**
         * Catch on modal hide vent to reset event id
         */
        on_modal_hide:function(){
            if(this.modals.add_event.evt_id != '')
            {
                this.modals.add_event.evt_id = '';
            }
        },
        /**
         * Catch on copy to clipboard event
         */
        onCopy: function () {
            // this.modals.deposit.opened = false;
            shared.notification('top','center','success','Le lien a bien été copié dans le presse-papier !','');
        },
        /**
         * Catch on on copy to clipboard error
         */
        onError: function () {
            shared.notification('top','center','danger','Une erreur est survenue lors de la copie !','');
        }
    },
}

</script>

<style scoped>

.btn {
    white-space: normal;
}

.date{
    width: 82%;
}

.container-fluid{
    margin-bottom: 5rem;
}
</style>