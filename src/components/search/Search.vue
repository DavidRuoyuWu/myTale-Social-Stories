<template>
  <div id = "search-bar">
    <header class="font-weight-light">
      SEARCH FOR A STORY HERE
    </header>
    <search-sorting/>
  </div>
</template>

<script>
import searchSort from './searchSort.vue'

export default {
  components:{
    'search-sorting': searchSort,
  },
  data (){
    return{
    }
  },
  methods: {
  },
  created(){
  }
}
</script>

<style scoped>
#search-bar{
  margin: 0 auto;
}
header{
  background: #FFA726;
  text-align: center;
  padding: 50px 10px;
  margin-top: -5px;
  font-family: Roboto, sans-serif;
  font-size: 36px;
  letter-spacing: 2px;
}
</style>
