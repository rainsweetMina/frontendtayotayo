<template>
  <div>
    <apexchart
      width="100%"
      height="300"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getApiResponseTimes } from '@/api/admin';

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
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#3B82F6'],
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeFormatter: {
        year: 'yyyy',
        month: 'MMM \'yy',
        day: 'dd MMM',
        hour: 'HH:mm'
      },
      formatter: function(value) {
        const date = new Date(value);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    },
    title: {
      text: '시간'
    },
    tickAmount: 10
  },
  yaxis: {
    labels: {
      formatter: (value) => `${value}ms`
    },
    title: {
      text: '평균 응답 시간 (ms)'
    },
    min: 0
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  tooltip: {
    x: {
      format: 'HH:mm',
      formatter: function(value) {
        const date = new Date(value);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    },
    y: {
      formatter: (value) => `응답 시간: ${value ? value.toFixed(2) : 0} ms`
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    row: {
      colors: ['transparent', 'transparent']
    }
  },
  markers: {
    size: 3,
    hover: {
      size: 5
    }
  },
  noData: {
    text: '데이터가 없습니다',
    align: 'center',
    verticalAlign: 'middle',
    offsetX: 0,
    offsetY: 0,
    style: {
      color: '#6c757d',
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial, sans-serif'
    }
  },
  dataLabels: {
    enabled: false
  }
});

const series = ref([
  {
    name: "응답 시간",
    data: []
  }
]);

// 초기 데이터 생성 (테스트용)
const generateInitialData = () => {
  const now = new Date().getTime();
  const data = [];
  
  // 5분 간격으로 12개 데이터 포인트 생성 (1시간)
  for (let i = 0; i < 12; i++) {
    data.push({
      x: now - (12 - i) * 300000, // 5분(300,000ms) 간격
      y: Math.floor(Math.random() * 50) + 50 // 50-100ms 사이 랜덤 값
    });
  }
  
  console.log('초기 테스트 데이터:', data);
  series.value[0].data = data;
};

// 데이터 유효성 검사
const validateData = (data) => {
  if (!Array.isArray(data)) {
    console.error('데이터가 배열이 아닙니다:', data);
    return false;
  }
  
  // 데이터 형식 검사
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (!item || typeof item !== 'object') {
      console.error(`데이터[${i}]가 객체가 아닙니다:`, item);
      return false;
    }
    
    if (item.x === undefined || item.y === undefined) {
      console.error(`데이터[${i}]에 x 또는 y 속성이 없습니다:`, item);
      return false;
    }
    
    if (isNaN(item.x) || isNaN(item.y)) {
      console.error(`데이터[${i}]의 x 또는 y가 NaN입니다:`, item);
      return false;
    }
  }
  
  return true;
};

// API 데이터 로드
const loadApiResponseData = async () => {
  try {
    console.log('API 응답 시간 데이터 로드 중...');
    const data = await getApiResponseTimes();
    console.log('API 응답 시간 데이터 로드 성공:', data);
    
    if (Array.isArray(data) && data.length > 0) {
      // 데이터 유효성 검사
      const validData = data.filter(item => {
        // x와 y가 유효한 숫자인지 확인
        const isValid = 
          item && 
          typeof item === 'object' && 
          item.x !== undefined && 
          item.y !== undefined && 
          !isNaN(item.x) && 
          !isNaN(item.y);
        
        if (!isValid) {
          console.warn('유효하지 않은 데이터 항목:', item);
        }
        
        return isValid;
      });
      
      if (validData.length > 0) {
        console.log('유효한 데이터:', validData);
        series.value[0].data = validData;
      } else {
        console.warn('유효한 데이터가 없습니다. 테스트 데이터를 사용합니다.');
        generateInitialData();
      }
    } else {
      console.warn('API 응답 시간 데이터가 비어있거나 배열이 아닙니다:', data);
      // 테스트 데이터 생성
      generateInitialData();
    }
  } catch (error) {
    console.error('API 응답 시간 데이터 로드 실패:', error);
    // 오류 발생 시 테스트 데이터 생성
    generateInitialData();
  }
};

// 주기적 데이터 갱신을 위한 타이머
let refreshTimer = null;

// 주기적으로 데이터 갱신
const startDataRefresh = () => {
  // 먼저 초기 데이터 로드
  loadApiResponseData();
  
  // 1분마다 데이터 갱신 (5분 단위 데이터이므로 더 짧은 간격으로 갱신)
  refreshTimer = setInterval(() => {
    loadApiResponseData();
  }, 60000); // 1분
};

onMounted(() => {
  // 초기 테스트 데이터 생성
  generateInitialData();
  
  // 실제 API 데이터 로드 및 주기적 갱신 시작
  startDataRefresh();
});

// 컴포넌트가 제거될 때 타이머 정리
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script> 