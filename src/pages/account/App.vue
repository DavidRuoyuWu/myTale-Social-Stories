<template>
  <v-app>
    <NavBar />
    <v-main class="container">
      <router-view></router-view>
      <!--<login />-->
    </v-main>
  </v-app>

</template>

<script>

import NavBar from '@/components/homepage/NavBar'
//import register from '@/components/users/register'
//import login from '@/components/users/login'

export default {
  title: 'MyTale - Make Your Own Social Stories',
  components:{
    NavBar,
    //register,
    //login
  },
  data(){
    return{

    }
  },
  methods:{
  },  
}
</script>

<style>
* {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
  }
/*#content {
    font-family: Roboto, sans-serif;
    line-height: 1.8;
    background-color: #FAFAFA;
  }*/

.container {
  height: 90vh;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}

</style>
