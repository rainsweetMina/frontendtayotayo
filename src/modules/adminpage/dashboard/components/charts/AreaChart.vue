<template>
  <div>
    <apexchart
      width="500"
      type="area"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const options = ref({
  chart: {
    id: "redis-memory",
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
      formatter: (value) => `${(value / 1024 / 1024).toFixed(2)} MB`
    }
  },
  stroke: {
    curve: 'smooth'
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.2,
      stops: [0, 90, 100]
    }
  },
  tooltip: {
    x: {
      format: 'HH:mm:ss'
    },
    y: {
      formatter: (value) => `${(value / 1024 / 1024).toFixed(2)} MB`
    }
  }
});

const series = ref([
  {
    name: "메모리 사용량",
    data: []
  }
]);

// WebSocket 연결 설정
let ws;

const connectWebSocket = () => {
  ws = new WebSocket('ws://your-backend-url/redis-metrics');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // 새로운 데이터 포인트 추가
    series.value[0].data.push({
      x: new Date().getTime(),
      y: data.memoryUsage
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