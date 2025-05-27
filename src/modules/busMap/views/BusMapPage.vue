<template>
  <div class="bus-map-page d-flex">
    <div class="searchBox">
      <SearchBox @search="searchBus"/>
      <BusStopList :busStops="busStops" @selectStop="moveToStop"/>
      <BusRouteList :routes="busRoutes"/>
    </div>
    <div class="map-container flex-grow-1">
      <MapView/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import MapView from '../components/MapView.vue'
import SearchBox from '../../busSearch/components/SearchBox.vue'
import BusStopList from '../../busSearch/components/BusStopList.vue'
import BusRouteList from '../../busSearch/components/BusRouteList.vue'
import {drawBusStopMarkers} from '@/composables/map-utils'

export default {
  components: {MapView, SearchBox, BusStopList, BusRouteList},
  data() {
    return {
      busStops: [],
      busRoutes: [],
      selectedRouteId: null
    }
  },
  methods: {
    async searchBus(keyword) {
      if (!keyword.trim()) return;
      try {
        const { data } = await axios.get('/api/bus/searchBSorBN', {
          params: { keyword }
        });
        this.busStops = data.busStops || [];
        this.busRoutes = data.busNumbers || [];
        drawBusStopMarkers(window.leafletMap, this.busStops);
      } catch (err) {
        console.error(err);
        alert('검색 중 오류가 발생했습니다.');
      }
    },
    moveToStop(stop) {
      const latlng = L.latLng(parseFloat(stop.ypos), parseFloat(stop.xpos));
      const map = window.leafletMap;
      map.setView(latlng, 16);
      const marker = window.busStopMarkers?.find(m =>
          m.getLatLng().lat === latlng.lat && m.getLatLng().lng === latlng.lng
      );
      if (marker) marker.openPopup();
    },
    selectRoute(route) {
      console.log('선택된 노선:', route);
      // 다음 단계에서 routeId 기반 경로 및 정류장 표시 추가
    }
  }
}
</script>

<style scoped>
.searchBox {
  width: 350px;
  z-index: 1080;
}
</style>