<template>
  <div class="schedule-view">
    <table class="schedule-table">
      <thead>
      <tr>
        <th>회차</th>
        <th v-for="(name, idx) in header" :key="idx">{{ name }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, idx) in schedules" :key="idx">
        <td>{{ idx + 1 }}</td>
        <td v-for="(name, idx2) in header" :key="idx2">
          {{ row[`schedule_${String.fromCharCode(65 + idx2)}`] || '' }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  header: Array,
  schedules: Array
})
</script>

<style scoped>
@import '../../assets/schedule.css';
</style>
