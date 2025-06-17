<template>
  <div class="bus-route-list">
    <div
        v-for="route in routes"
        :key="route.routeId"
        class="bus-route-item"
        :class="getTextClass(route.routeNo)"
        @click="selectRoute(route)"
    >
      <!-- 노선번호와 색상 뱃지 -->
      <strong style="font-size: 17px">
        <span :class="['badge', getBadgeClass(route.routeNo)]">
          {{ getRouteType(route.routeNo) }}
        </span>
        <span class="ms-2">{{ route.routeNo }}</span>
      </strong>
      <span v-if="route.routeNote" class="ms-1 text-muted route-note" :title="route.routeNote">
        ({{ route.routeNote }})
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routes: Array
  },
  emits: ['select'],
  methods: {
    selectRoute(route) {
      this.$emit('select', route)
    },
    getRouteType(routeNo) {
      if (routeNo.startsWith('순환')) return '순환'
      if (routeNo.startsWith('급행')) return '급행'
      if (routeNo.startsWith('직행')) return '직행'
      if (routeNo.startsWith('군위')) return '마을'
      if (/^\d+(-\d+)?$/.test(routeNo)) return '간선'
      return '지선'
    },
    getBadgeClass(routeNo) {
      if (routeNo.startsWith('순환')) return 'badge-yellow'
      if (routeNo.startsWith('급행')) return 'badge-red'
      if (routeNo.startsWith('직행')) return 'badge-red'
      if (routeNo.startsWith('군위')) return 'badge-green'
      if (/^\d+(-\d+)?$/.test(routeNo))  return 'badge-blue'
      return 'badge-green'
    },
    getTextClass(routeNo) {
      if (routeNo.startsWith('순환')) return 'text-yellow'
      if (routeNo.startsWith('급행')) return 'text-red'
      if (routeNo.startsWith('직행')) return 'text-red'
      if (routeNo.startsWith('군위')) return 'text-green'
      if (/^\d+(-\d+)?$/.test(routeNo))  return 'text-blue'
      return 'text-green'
    }
  }
}
</script>

<style scoped>
.bus-route-list {
  padding: 5px 20px;
}
.bus-route-item {
  padding: 18px 18px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  background: #fff;
  transition: background 0.2s;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.bus-route-item:hover {
  background-color: #f5f5f5;
}
.route-note {
  font-size: 14px;
  font-weight: bold;
}

/* 색상 클래스 */
.badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.75em;
  color: white;
}
.badge-yellow { background-color: #f1c40f; }
.badge-red { background-color: #e74c3c; }
.badge-blue { background-color: #3498db; }
.badge-green { background-color: #2ecc71; }

.text-yellow strong { color: #f1c40f; }
.text-red strong    { color: #e74c3c; }
.text-blue strong   { color: #3562ff; }
.text-green strong  { color: #2ecc71; }
</style>