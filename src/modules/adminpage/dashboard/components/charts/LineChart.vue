<template>
  <div class="chart-container">
    <apexchart
      width="100%"
      height="320"
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
    },
    parentHeightOffset: 0,
    sparkline: {
      enabled: false
    },
    fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif'
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
      },
      style: {
        fontSize: '10px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 500
      }
    },
    title: {
      text: '시간',
      offsetY: 5,
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 600
      }
    },
    tickAmount: 10,
    axisBorder: {
      show: true,
      color: '#E5E7EB'
    },
    axisTicks: {
      show: true,
      color: '#E5E7EB'
    }
  },
  yaxis: {
    labels: {
      formatter: (value) => `${value}ms`,
      style: {
        fontSize: '10px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 500
      },
      offsetX: 5
    },
    title: {
      text: '평균 응답 시간 (ms)',
      style: {
        fontSize: '12px',
        fontFamily: 'Pretendard, sans-serif',
        fontWeight: 600
      },
      offsetX: 5
    },
    min: 0,
    max: 70,
    forceNiceScale: true,
    tickAmount: 7
  },
  stroke: {
    curve: 'smooth',
    width: 3
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
    },
    style: {
      fontSize: '12px',
      fontFamily: 'Pretendard, sans-serif'
    }
  },
  grid: {
    borderColor: '#f1f1f1',
    row: {
      colors: ['transparent', 'transparent']
    },
    padding: {
      top: 5,
      right: 45,
      bottom: 5,
      left: 5
    },
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
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
      fontFamily: 'Pretendard, sans-serif',
      fontWeight: 500
    }
  },
  dataLabels: {
    enabled: false
  },
  annotations: {
    position: 'back',
    yaxis: [
      {
        y: 20,
        y2: 0,
        fillColor: '#CCFBF1',
        opacity: 0.3,
        borderWidth: 0,
        label: {
          borderColor: '#14B8A6',
          style: {
            fontSize: '11px',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600,
            color: '#14B8A6',
            background: 'transparent',
            cssClass: 'apexcharts-annotation-label'
          },
          text: '최적',
          position: 'right',
          offsetX: 10,
          offsetY: 0,
          textAnchor: 'start'
        }
      },
      {
        y: 40,
        y2: 20,
        fillColor: '#E0F2FE',
        opacity: 0.3,
        borderWidth: 0,
        label: {
          borderColor: '#0EA5E9',
          style: {
            fontSize: '11px',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600,
            color: '#0EA5E9',
            background: 'transparent',
            cssClass: 'apexcharts-annotation-label'
          },
          text: '양호',
          position: 'right',
          offsetX: 10,
          offsetY: 0,
          textAnchor: 'start'
        }
      },
      {
        y: 70,
        y2: 40,
        fillColor: '#FEF3C7',
        opacity: 0.3,
        borderWidth: 0,
        label: {
          borderColor: '#F59E0B',
          style: {
            fontSize: '11px',
            fontFamily: 'Pretendard, sans-serif',
            fontWeight: 600,
            color: '#F59E0B',
            background: 'transparent',
            cssClass: 'apexcharts-annotation-label'
          },
          text: '주의',
          position: 'right',
          offsetX: 10,
          offsetY: 0,
          textAnchor: 'start'
        }
      }
    ]
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
      // 백엔드에서 받은 데이터 형식 확인
      console.log('첫 번째 데이터 항목 형식:', data[0]);

      // 데이터 형식 변환 (date와 averageResponseTime 형식 처리)
      if (data[0] && (data[0].date || data[0].averageResponseTime !== undefined)) {
        const formattedData = data.map(item => {
          // 날짜 문자열을 Date 객체로 변환
          let timestamp;
          try {
            if (item.date) {
              // date가 HH:mm 형식인 경우 오늘 날짜와 결합
              const today = new Date();
              const [hours, minutes] = item.date.split(':').map(Number);
              today.setHours(hours, minutes, 0, 0);
              timestamp = today.getTime();
            } else {
              // 타임스탬프가 없는 경우 현재 시간 사용
              timestamp = new Date().getTime();
            }
          } catch (error) {
            console.error('날짜 변환 오류:', error, item);
            timestamp = new Date().getTime();
          }

          // 응답 시간 값 추출
          let responseTime = 0;
          if (typeof item.averageResponseTime === 'number') {
            responseTime = item.averageResponseTime;
          } else if (typeof item.averageResponseTime === 'string') {
            responseTime = parseFloat(item.averageResponseTime) || 0;
          }

          return {
            x: timestamp,
            y: responseTime
          };
        });

        // 유효한 데이터만 필터링 (NaN 제거)
        const validData = formattedData.filter(item =>
          !isNaN(item.x) && !isNaN(item.y) && item.x > 0
        );

        // 시간순 정렬
        validData.sort((a, b) => a.x - b.x);

        // 매우 극단적인 이상치만 제거 (평균에서 5표준편차 이상 벗어나는 값)
        const processedData = removeExtremesOnly(validData);

        // 최소한의 스무딩만 적용 (원본 데이터 특성 유지)
        const finalData = applyMinimalSmoothing(processedData);

        console.log('처리된 API 응답 시간 데이터:', finalData);

        if (finalData.length > 0) {
          series.value[0].data = finalData;
          return;
        }
      }

      // 기존 x, y 형식 처리 (백업 로직)
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
        // 매우 극단적인 이상치만 제거하고 최소한의 스무딩 적용
        const processedData = removeExtremesOnly(validData);
        const finalData = applyMinimalSmoothing(processedData);

        console.log('유효한 데이터:', finalData);
        series.value[0].data = finalData;
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

// 극단적인 이상치만 제거하는 함수
const removeExtremesOnly = (data) => {
  if (!data || data.length <= 3) return data;

  // y값들의 평균과 표준편차 계산
  const yValues = data.map(item => item.y);
  const mean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
  const stdDev = Math.sqrt(
    yValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / yValues.length
  );

  // 매우 극단적인 이상치만 제거 (평균 ± 5 표준편차)
  const threshold = 5.0;
  const lowerBound = Math.max(0, mean - threshold * stdDev); // 음수 방지
  const upperBound = mean + threshold * stdDev;

  console.log(`극단적 이상치 제거 - 평균: ${mean.toFixed(2)}, 표준편차: ${stdDev.toFixed(2)}`);
  console.log(`허용 범위: ${lowerBound.toFixed(2)} ~ ${upperBound.toFixed(2)}`);

  // 허용 범위 내의 데이터만 필터링하고, 70ms 이상은 70ms로 제한
  return data.filter(item => {
    const isValid = item.y >= lowerBound && item.y <= upperBound;
    if (!isValid) {
      console.log(`극단적 이상치 제거됨: ${item.y}`);
    }
    return isValid;
  }).map(item => ({
    x: item.x,
    y: Math.min(item.y, 70) // 70ms로 제한
  }));
};

// 최소한의 스무딩만 적용하는 함수
const applyMinimalSmoothing = (data) => {
  if (!data || data.length <= 5) return data;

  const result = [...data]; // 원본 데이터 복사

  // 매우 급격한 변화만 부드럽게 처리
  for (let i = 1; i < data.length - 1; i++) {
    const prev = data[i-1].y;
    const current = data[i].y;
    const next = data[i+1].y;

    // 현재 값이 이전과 다음 값과 크게 차이나는 경우에만 스무딩 적용
    const avgNeighbors = (prev + next) / 2;
    const diffRatio = Math.abs(current - avgNeighbors) / avgNeighbors;

    if (diffRatio > 0.5) { // 50% 이상 차이나는 경우에만 스무딩
      // 현재 값에 70% 가중치, 이웃 평균에 30% 가중치 부여
      result[i] = {
        x: data[i].x,
        y: Math.min(parseFloat((current * 0.7 + avgNeighbors * 0.3).toFixed(2)), 70) // 70ms로 제한
      };
    }
  }

  return result;
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

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 라벨이 잘리지 않도록 스타일 추가 */
:deep(.apexcharts-yaxis-annotations text) {
  font-weight: 600 !important;
  font-size: 11px !important;
  font-family: 'Pretendard', sans-serif !important;
}

:deep(.apexcharts-yaxis-annotations rect) {
  rx: 2;
  ry: 2;
}

/* 모든 차트 텍스트에 Pretendard 폰트 적용 */
:deep(.apexcharts-text) {
  font-family: 'Pretendard', sans-serif !important;
}

:deep(.apexcharts-title-text),
:deep(.apexcharts-yaxis-title-text),
:deep(.apexcharts-xaxis-title-text) {
  font-family: 'Pretendard', sans-serif !important;
  font-weight: 600 !important;
}

:deep(.apexcharts-tooltip) {
  font-family: 'Pretendard', sans-serif !important;
}
</style>
