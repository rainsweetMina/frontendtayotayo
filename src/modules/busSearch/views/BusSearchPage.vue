<template>
  <div class="sidebar-content">
    <SearchBox @search="searchBus"/>
    <BusStopList :stops="busStops" @selectStop="moveToStop"/>
    <BusRouteList :routes="busRoutes" @select="selectRoute"/>
  </div>
</template>

<script>
import {drawBusRouteMapORS, drawBusStopMarkers, clearMapElements} from '@/composables/map-utils'
import axios from "axios";

import SearchBox from '../components/SearchBox.vue'
import BusStopList from '../components/BusStopList.vue'
import BusRouteList from "../components/BusRouteList.vue";

export default {
  components: {SearchBox, BusStopList, BusRouteList},
  data() {
    return {
      busStops: [],
      busRoutes: []
    }
  },
  methods: {
    async searchBus(keyword) {
      if (!keyword.trim()) return;

      try {
        const map = window.leafletMap;
        if (map) {
          clearMapElements(map);  // ✅ 여기!
        }
        const {data} = await axios.get('/api/bus/searchBSorBN', {
          params: {keyword}
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
    async selectRoute(route) {
      const routeId = route.routeId;

      try {
        const [stopRes, linkRes] = await Promise.all([
          axios.get('/api/bus/bus-route', {params: {routeId}}),
          axios.get('/api/bus/bus-route-link', {params: {routeId}})
        ]);

        const stopData = stopRes.data;
        const linkData = linkRes.data.forward || [];

        const map = window.leafletMap;

        drawBusStopMarkers(map, stopData);
        drawBusRouteMapORS(map, linkData);

        if (linkData.length > 0) {
          const first = linkData[0];
          map.setView([parseFloat(first.ypos), parseFloat(first.xpos)], 16);
        }
      } catch (err) {
        console.error('🛑 노선 데이터 조회 실패:', err);
        alert('노선 정보를 불러오는 데 실패했습니다.');
      }
    }
  }
}
</script>
