<template>
  <iframe v-if="kibana" :src="kibana" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

export default class Dashboard extends Vue {
  kibana = process.env.VUE_APP_KIBANA || ''

  created() {
    this.$store.commit('ui/setHeaderTitle', 'Dashboard')
  }
}
</script>

<style>
iframe {
  display: block;
  border: none;
  height: 100vh;
  width: 100%;
}
</style>

