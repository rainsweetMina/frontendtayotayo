<template>
  <div>
    <apexchart
      width="500"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref } from "vue";

const options = ref({
  chart: {
    id: "hourly-usage",
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: ['06-08', '08-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'],
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    }
  }
});

const series = ref([
  {
    name: "이용 건수",
    data: [30, 70, 45, 50, 49, 80, 70, 30]
  }
]);
</script> 