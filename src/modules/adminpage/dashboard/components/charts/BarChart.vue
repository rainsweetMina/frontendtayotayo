<template>
  <div>
    <apexchart
      ref="chart"
      width="100%"
      height="300"
      type="bar"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, onMounted, nextTick } from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({
      categories: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      data: [30, 70, 45, 50, 49, 80, 70, 30]
    })
  }
});

const chart = ref(null);

const options = ref({
  chart: {
    id: "hourly-usage",
    toolbar: {
      show: false
    },
    redrawOnWindowResize: true,
    redrawOnParentResize: true,
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'
  },
  xaxis: {
    categories: [],
    title: {
      text: '시간',
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 600
      }
    },
    labels: {
      formatter: function(value) {
        // 값이 숫자인 경우 시간 형식으로 변환
        if (!isNaN(value)) {
          return value + ':00';
        }

        // 이미 시간 형식인 경우 그대로 반환
        if (typeof value === 'string' && value.includes(':')) {
          return value;
        }

        // 소수점이 있는 경우 (예: 2.67:00) 처리
        if (typeof value === 'string' && value.includes('.')) {
          return value.replace(/\.\d+/, ':00');
        }

        return value;
      },
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 500
      },
      rotate: 0,
      trim: false,
      hideOverlappingLabels: false
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    },
    tickPlacement: 'on'
  },
  yaxis: {
    title: {
      text: '요청 건수',
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 600
      }
    },
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 500
      }
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
    enabled: true,
    formatter: function (val) {
      return val;
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      fontFamily: 'Pretendard, sans-serif',
      colors: ["#304758"]
    }
  },
  tooltip: {
    y: {
      formatter: (value) => `${value}건`
    },
    style: {
      fontSize: '12px',
      fontFamily: 'Pretendard, sans-serif'
    }
  }
});

const series = ref([
  {
    name: "요청 건수",
    data: []
  }
]);

// 초기화 시 데이터 확인 로그
onMounted(() => {
  console.log('BarChart 컴포넌트 마운트됨, 초기 데이터:', props.data);
  updateChartData(props.data);
});

// 차트 데이터 업데이트 함수
const updateChartData = async (data) => {
  if (!data) return;

  console.log('차트 데이터 업데이트:', data);
  console.log('카테고리 타입:', typeof data.categories, '값:', data.categories);
  console.log('데이터 타입:', typeof data.data, '값:', data.data);

  if (Array.isArray(data.categories)) {
    console.log('카테고리 항목 샘플:');
    data.categories.forEach((cat, index) => {
      console.log(`  [${index}] 타입: ${typeof cat}, 값: ${cat}`);
    });
  }

  // 카테고리 및 데이터 업데이트
  options.value.xaxis.categories = [...data.categories];
  series.value[0].data = [...data.data];

  // 데이터 라벨 표시 여부 결정 (데이터가 많으면 비활성화)
  options.value.dataLabels.enabled = data.categories.length <= 10;

  // 차트 설정 확인
  console.log('업데이트된 차트 설정:', {
    categories: options.value.xaxis.categories,
    data: series.value[0].data
  });

  // 차트 강제 업데이트
  await nextTick();
  if (chart.value && chart.value.chart) {
    try {
      console.log('차트 강제 업데이트 시도');
      chart.value.chart.updateOptions({
        xaxis: {
          ...options.value.xaxis,
          categories: [...data.categories]
        }
      });
      chart.value.chart.updateSeries([{
        name: "요청 건수",
        data: [...data.data]
      }]);
    } catch (err) {
      console.error('차트 업데이트 중 오류 발생:', err);
    }
  }
};

// props 변경 시 차트 데이터 업데이트
watch(() => props.data, (newData) => {
  updateChartData(newData);
}, { deep: true });
</script>

<style scoped>
/* 모든 차트 텍스트에 Pretendard 폰트 적용 */
:deep(.apexcharts-text) {
  font-family: 'Pretendard', sans-serif !important;
}

:deep(.apexcharts-title-text),
:deep(.apexcharts-yaxis-title-text),
:deep(.apexcharts-xaxis-title-text) {
  font-family: 'Pretendard', sans-serif !important;
  font-weight: 600 !important;
  font-size: 12px !important;
}

:deep(.apexcharts-xaxis-label),
:deep(.apexcharts-yaxis-label) {
  font-family: 'Pretendard', sans-serif !important;
  font-size: 12px !important;
}

:deep(.apexcharts-tooltip) {
  font-family: 'Pretendard', sans-serif !important;
}

:deep(.apexcharts-datalabel) {
  font-family: 'Pretendard', sans-serif !important;
}
</style>
