<template>
  <div class="bus-stop-list p-2">
    <div
        v-for="stop in stops"
        :key="stop.bsId"
        class="bus-stop-item"
        @click="selectStop(stop)"
    >
      <strong>{{ stop.bsNm }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stops: Array
  },
  emits: ['select'],
  methods: {
    selectStop(stop) {
      this.$emit('select', stop)
    }
  }
}
</script>

<style scoped>
.bus-stop-item {
  color: #4889cd;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.bus-stop-item:hover {
  background: #f0f0f0;
}
</style>