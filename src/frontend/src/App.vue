<!--
 * @Author: David Carvalho 
 * @Date: 2018-06-06
 * @Last Modified by: David Carvalho
 * @Last Modified time: -
 * @Place: ETML - Lausanne
 * @License: MIT
-->
<template>
    <div id="app">
        <notifications></notifications>
        <router-view/>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.modal-open {
    padding-right: 0 !important;
}

html {
    overflow:   scroll;
    overflow-x: hidden;
}
::-webkit-scrollbar {
    width: 0px;
    background: transparent; /* make scrollbar transparent */
}

.box-shadow{
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .05)
}


.swal-wide{
    width: 85%!important;
}
</style>
