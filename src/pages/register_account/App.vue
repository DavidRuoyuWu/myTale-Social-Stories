<template>
  <v-app>
    <NavBar />
    <v-main class="container">
      <register />
    </v-main>
  </v-app>

</template>

<script>

import NavBar from '@/components/homepage/NavBar'
import register from '@/components/users/register'

export default {
  title: 'MyTale - Make Your Own Social Stories',
  components:{
    NavBar,
    register,
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

.container {
  height: 90vh;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
}
</style>
