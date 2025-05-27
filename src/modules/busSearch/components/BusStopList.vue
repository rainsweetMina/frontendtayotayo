<template>
  <div id="busStopList">
    <div v-for="stop in stops" :key="stop.id">
      {{ stop.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stops: Array
  }
}
</script>
