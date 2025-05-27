<template>
  <div class="bus-map-page">
    <MapView />
  </div>
</template>

<script>
import MapView from '../components/MapView.vue'

export default {
  components: { MapView },
  mounted() {

  }
}
</script>

<style scoped>
.bus-map-page {
  padding: 1rem;
}
</style>