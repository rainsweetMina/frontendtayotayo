<template>
  <div>
    <apexchart
      width="380"
      type="donut"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from "vue";

const options = ref({
  labels: ['1001번', '2000번', '3000번', '4000번', '5000번'],
  chart: {
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%'
      }
    }
  }
});

const series = ref([44, 55, 41, 17, 15]);
</script> 