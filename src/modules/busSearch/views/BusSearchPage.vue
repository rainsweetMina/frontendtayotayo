<template>
  <div class="sidebar-content">
    <SearchBox @search="searchBus" />
    <BusStopList :stops="busStops" />
  </div>
</template>

<script>
import SearchBox from '../components/SearchBox.vue'
import BusStopList from '../components/BusStopList.vue'
import { drawBusStopMarkers } from '@/composables/map-utils'

export default {
  components: { SearchBox, BusStopList },
  data() {
    return {
      busStops: []
    }
  },
  methods: {
    async searchBus(keyword) {
      if (!keyword.trim()) {
        alert('검색어를 입력하세요.');
        return;
      }

      try {
        const res = await fetch(`/api/bus/searchBSorBN?keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();

        this.busStops = data.busStops || [];

        if (this.busStops.length > 0) {
          // ✅ 지도 마커 찍기
          drawBusStopMarkers(window.leafletMap, this.busStops);

          // ✅ 지도 위치 이동
          const first = this.busStops[0];
          if (first?.xpos && first?.ypos) {
            const latlng = L.latLng(parseFloat(first.ypos), parseFloat(first.xpos));
            window.leafletMap.setView(latlng, 16);
          }
        }
      } catch (err) {
        console.error('❌ 검색 실패:', err);
      }
    }
  }
}
</script>
