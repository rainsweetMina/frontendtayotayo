<template>
  <div>
    <apexchart
      width="500"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const options = ref({
  chart: {
    id: "api-response-time",
    animations: {
      enabled: true,
      easing: 'linear',
      dynamicAnimation: {
        speed: 1000
      }
    },
    toolbar: {
      show: false
    }
  },
  xaxis: {
    type: 'datetime'
  },
  yaxis: {
    labels: {
      formatter: (value) => `${value}ms`
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  tooltip: {
    x: {
      format: 'HH:mm:ss'
    }
  }
});

const series = ref([
  {
    name: "응답 시간",
    data: []
  }
]);

// WebSocket 연결 설정
let ws;

const connectWebSocket = () => {
  ws = new WebSocket('ws://your-backend-url/api-metrics');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // 새로운 데이터 포인트 추가
    series.value[0].data.push({
      x: new Date().getTime(),
      y: data.responseTime
    });

    // 최근 30개의 데이터 포인트만 유지
    if (series.value[0].data.length > 30) {
      series.value[0].data.shift();
    }
  };

  ws.onclose = () => {
    // 연결이 끊어지면 3초 후 재연결 시도
    setTimeout(connectWebSocket, 3000);
  };
};

onMounted(() => {
  connectWebSocket();
});

// 컴포넌트가 제거될 때 WebSocket 연결 종료
onUnmounted(() => {
  if (ws) {
    ws.close();
  }
});
</script> 