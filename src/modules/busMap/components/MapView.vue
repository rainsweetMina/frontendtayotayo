<template>
  <div id="map" ref="mapRef" class="leaflet-map"></div>
</template>

<script>
import L from 'leaflet'

export default {
  name: 'MapView',
  mounted() {
    const mapContainer = this.$refs.mapRef;

    const map = L.map(mapContainer).setView([35.8714, 128.6014], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    window.leafletMap = map;

    // ✅ 렌더링 이후 사이즈 강제 재계산
    this.$nextTick(() => {
      map.invalidateSize();
    });
  }
}
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
