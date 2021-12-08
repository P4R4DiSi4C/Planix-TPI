<!--
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Planix layout shared between children components.
-->
<template>
    <div>
        <header>
            <b-navbar toggleable="md" type="dark" variant="dark">
                <b-container fluid class="justify-content-center">
                    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

                    <b-navbar-brand to=/home>Planix</b-navbar-brand>

                    <b-collapse is-nav id="nav_collapse">

                        <b-navbar-nav>
                            <b-nav-item v-if="logged_in" to=/cp>
                                Centre de contrôle
                            </b-nav-item>
                            <b-nav-item to=/howto>
                                Manuel
                            </b-nav-item>
                        </b-navbar-nav>

                        <b-navbar-nav class="ml-auto">
                            <b-nav-item right class="social-btn">
                                <b-button size="sm" v-if="!logged_in" ref="googleAuth" class="btn-danger" v-on:click="login">
                                    <i class="fab fa-google"></i> Se connecter avec <b>Google</b>
                                </b-button>
                                <b-button size="sm" v-else class="btn-danger" v-on:click="logout(true)">
                                    <i class="fas fa-sign-out-alt"></i> Se déconnecter
                                </b-button>  
                            </b-nav-item>
                        </b-navbar-nav>
                    </b-collapse>
                </b-container>
            </b-navbar>

            <b-modal id="sign_up_modal" size="sm" v-model="modals.sign_up.opened" centered hide-footer title="Détails d'inscription">
                <b-form-group>
                    <b-form-input type="text" style="width:100%;" placeholder="Prénom" v-model="modals.sign_up.firstname" ></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-form-input type="text" style="width:100%;" placeholder="Nom" v-model="modals.sign_up.lastname"></b-form-input>
                </b-form-group>
                <b-form-group>
                    <b-form-input type="tel" style="width:100%;" placeholder="Téléphone" v-model="modals.sign_up.phone"></b-form-input>
                </b-form-group>
                
                <b-button style="border-radius: 5rem;" class="btn-block btn-outline-primary" v-on:click="sign_up">
                   S'inscrire
                </b-button>
            </b-modal>
        </header>
        
        
        
        <router-view></router-view> 
       


        <b-navbar fixed="bottom" type="dark" variant="dark">
            <div class="container-fluid">
                <b-navbar-nav class="ml-auto">
                    <b-nav-text style="color:white;" right>David Carvalho - CIN4a © Tous droits réservés - 2018</b-nav-text>
                </b-navbar-nav>
            </div>
        </b-navbar>
    </div>
</template>

<script>
    // Import vue for gooleAuth object
    import Vue from 'vue'

    // Import helper
    import shared from '../helpers/shared_methods.js';

    export default {
        data () {
            return {
                error: '',
                modals: {
                    sign_up: {
                        opened: false,
                        firstname: '',
                        lastname: '',
                        phone: '',
                        token: null
                    }
                },
                logged_in: (localStorage.getItem("token") !== null)
            }
        },
        created(){
            // Keep this on a self var
            let self = this;

            // Interceptor for 401 http codes to logout
            this.$http.interceptors.response.use(
                function (response) {
                    // continue sending response
                    return Promise.resolve(response)
                },
                function (error) {
                    // check if unauthorized error returned
                    if (error.response.status === 401) {
                        shared.session_expired();
                        self.logout(false);
                    }
                    // request is rejected and will direct logic to the catch() method
                    return Promise.reject(error)
                })
        },
        methods: {
            /**
             * Logout function deleting any cookies/token
             */
            logout: function(is_user){
                // Remove token / cookie
                localStorage.removeItem('token');
                this.delete_cookie_anon();

                // Set logged_in var to false
                this.logged_in = false;

                // Push home route
                this.$router.push('/');
                
                // If user pressed logout button, display notification
                if(is_user)
                    shared.notification('top','center','warning','Déconnexion réussie !','');
            },
            /**
             * Login function using googleAuth library
             */
            login(){
                Vue.googleAuth().signIn(this.login_success, this.login_error)
            },
            /**
             * If login with Google was successfull
             */
            login_success: async function(authorizationCode) {
                try{
                    // Send auth code to backend
                    let response = await this.$http.post(this.$url+'/user/oauth/google', { code: authorizationCode});

                    // If login worked, delete anon cookie if exists
                    this.delete_cookie_anon();

                    // Set token in session
                    localStorage.setItem('token', response.data.token)

                    // Set user logged_in
                    this.logged_in = true;

                    shared.notification('top','center','success',response.data.message,'');
                }
                catch(error)
                {
                    // If backend returns response
                    if(error.response)
                    {
                        // If registration not completed
                        if(error.response.data.message == "SIGN_UP")
                        {
                            // Set temporary token containing user id
                            this.modals.sign_up.token = error.response.data.token;

                            // Open sign up modal
                            this.modals.sign_up.opened = true;
                        }
                        else{
                            shared.notification('top','center','danger',error.response.data.message,'');
                        }
                    }else
                    {
                        //shared.notification('top','center','danger',error,'');
                        console.log(error);
                    }
                }
            },
            /**
             * If login with Google failed
             */
            login_error: function (error) {
                // Google error
                //console.log('GOOGLE SERVER - SIGN-IN ERROR', error)
                shared.notification('top','center','danger','Une erreur est survenue lors de la connexion Google','')
            },
            /**
             * Handle extra sign_up modal
             */
            sign_up: async function(){
                try{
                    // Sign up user with data from form
                    let response = await this.$http.post
                    (
                        this.$url+'/user/sign_up', 
                        { 
                            firstname: this.modals.sign_up.firstname,
                            lastname: this.modals.sign_up.lastname,
                            phone: this.modals.sign_up.phone
                        },
                        {
                            headers:
                            {
                                'Authorization': this.modals.sign_up.token
                            }
                        }
                    );

                    // Close modal
                    this.modals.sign_up.opened = false;

                    // Delete anon cookie if exists
                    this.delete_cookie_anon();

                    // Set user token
                    this.modals.sign_up.token = null;
                    localStorage.setItem('token', response.data.token)

                    // Set logged in
                    this.logged_in = true;

                    shared.notification('top','center','success',response.data.message,'');
                }
                catch(error){
                    if(error.response){
                        shared.notification('top','center','danger',error.response.data.message,'');
                    }
                    else{
                        console.log(error);
                    }
                }
            },
            /**
             * Function to clear anon cookie from browser
             */
            delete_cookie_anon: function(){
                if(this.$cookie.get('token_anon'))
                    this.$cookie.delete('token_anon');
            }
        }
    }
</script>

<style scoped>

@media (min-width: 768px) {
.navbar-brand.abs
    {
        position: absolute;
        width: 100%;
        left: 0;
        text-align: center;
    }
}
.social-btn .btn {
    color: #fff;
    font-size: 15px;
    border-radius: 50px;	
}

.social-btn .btn:hover {
    opacity: 0.9;
}

.social-btn .btn-danger {
    background: #df4930;
}
</style>