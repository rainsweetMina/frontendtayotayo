<template>
  <div>
    <apexchart
      width="100%"
      height="300"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      data: [30, 70, 45, 50, 49, 80, 70, 30]
    })
  }
});

const options = ref({
  chart: {
    id: "hourly-usage",
    toolbar: {
      show: false
    }
  },
  xaxis: {
    categories: props.data.categories,
    title: {
      text: '시간'
    }
  },
  yaxis: {
    title: {
      text: '요청 건수'
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: '60%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  colors: ['#3B82F6'],
  dataLabels: {
    enabled: false
  },
  tooltip: {
    y: {
      formatter: (value) => `${value}건`
    }
  }
});

const series = ref([
  {
    name: "요청 건수",
    data: props.data.data
  }
]);

// props 변경 시 차트 데이터 업데이트
watch(() => props.data, (newData) => {
  if (newData) {
    options.value.xaxis.categories = newData.categories;
    series.value[0].data = newData.data;
  }
}, { deep: true });
</script> 