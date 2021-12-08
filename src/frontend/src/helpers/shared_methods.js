/*
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
 * @Description: Helper file with useful methods shared by components
 */

// Import Vue to access global vars
import Vue from 'vue';

// Import sweetalert
import swal from 'sweetalert';

export default {
    // Google calendar modal
    gcal_modal: async function(confirmation,events){
        // Create google events table to put in the modal
        let table = `<table class='table'>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Créateur</th>
                                <th>Début</th>
                                <th>Fin</th>
                            </tr>
                        </thead>
                        <tbody>`;                                       

        for(let i = 0;i<events.length;i++)
        {
                table += `<tr>
                            <td>`+ events[i].summary +`</td>
                            <td>`+ events[i].creator +`</td>
                            <td>`+ this.get_evt_date(events[i].start) +`</td>
                            <td>`+ this.get_evt_date(events[i].end) +`</td>
                            </tr>`;
        }
        
        table += '</tbody></table>';

        let elem = document.createElement("div");
        elem.className = "table-responsive";
        elem.innerHTML = table;

        // Set sweetalert elements
        let text = 'Un ou plusieurs événements Google sont planifiés à cette même date.';
        let button;
        let buttons;
        let dangerMode = false;

        if(confirmation){
            text += ' Souhaitez-vous poursuivre ?';
            buttons = ['Non','Oui'];
            dangerMode = true;
        }
        else{
            button = 'Ok';
        }

        // Return sweet alert
        return await swal
        ({
            title: "Événements Google",
            text,
            content:elem,
            className: 'swal-wide',
            icon: "warning",     
            dangerMode,
            button,
            buttons            
        }).then((confirmed) => {
            if (confirmed) {
                return true;
            } 
            else
            {
                return false;
            }
        });
    },
    // Get event date with moment.js for formatting
    get_evt_date: function(date){
        return Vue.prototype.$moment(date).format("dddd Do MMMM YYYY [à] HH[h]mm");   
    },
    // Method allowing the display of notifications
    notification: function(verticalAlign, horizontalAlign, type, text,icon)//Types: '', 'info', 'success', 'warning', 'danger'
    {
        let notification = {
            template: '<span>'+ text +'</span>'
        };
        
        Vue.prototype.$notify(
            {
                component: notification,
                icon: icon,
                horizontalAlign: horizontalAlign,
                verticalAlign: verticalAlign,
                type: type
            }
        );
    },
    session_expired: function(){
        swal("Session expirée", "Votre session a expiré. Merci de vous connecter.", "warning");
    }
}