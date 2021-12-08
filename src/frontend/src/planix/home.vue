<!--
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Planix homepage
-->
<template>
    <b-container fluid>
        <vue-headful
            title="Planix- Accueil"
            description="Page d'accueil de Planix"
        />

        <b-row class="justify-content-md-center px-3 py-3 pt-md-5 pb-md-4" style="text-align: center;">
            <b-col cols="12" md="6">
                <h1>
                    Planix
                </h1>
                <p class="lead">
                    Planix, c'est quoi ?
                </p>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12" md="4" class="mb-3">
                <b-card header-tag="header" align="center" class="h-100 box-shadow">
                    <h4 slot="header" class="mb-0">Créer</h4>
                    Planix vous permet de créer des événements.
                        Créer un événement et invitez vos amis à l'aide du lien d'invitaton.
                </b-card>
            </b-col>
            <b-col cols="12" md="4" class="mb-3">
                <b-card  header-tag="header" align="center" class="h-100 box-shadow">
                    <h4 slot="header" class="mb-0">Participer</h4>
                    <p class="card-text">Planix vous permet de participer à des événements.</p>
                    <p class="card-text">Vos amis peuvent créer un événement et vous inviter à l'aide d'un lien d'invitation.</p>
                </b-card>
            </b-col>
            <b-col cols="12" md="4" class="mb-3"> 
                <b-card header-tag="header" align="center" class="h-100 box-shadow">
                    <h4 slot="header" class="mb-0">Gérer</h4>
                    <p class="card-text">Gérez vos événement avec le centre de contrôle de Planix.</p>
                    <p class="card-text">Inscrivez-vous et profiter du centre de contrôle de Planix vous permettant de créer un événement et d'avoir un aperçu de vos événemets et participations.</p>
                </b-card> 
            </b-col> 
        </b-row>
    </b-container>
</template>

<script>

export default {
    data () {
        return {

        }
    },
    methods: {
       
    },
}

</script>

<style scoped>

.lead {
    font-size: 1.25rem;
    font-weight: 300;
}

.box-shadow{
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .05)
}

.container-fluid{
    margin-bottom: 5rem;
}
</style>