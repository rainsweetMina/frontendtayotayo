<template>
  <div class="bus-route-list p-2">
    <div
        v-for="route in routes"
        :key="route.routeId"
        class="bus-route-item"
        @click="selectRoute(route)"
    >
      <strong>{{ route.routeNo }}</strong>
      <span v-if="route.routeNote" class="ms-1 text-muted">({{ route.routeNote }})</span>
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
    }
  }
}
</script>

<style scoped>
.bus-route-item {
  padding: 10px;
  border: 1px solid #999;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
}
.bus-route-item:hover {
  background-color: #f5f5f5;
}
</style>
