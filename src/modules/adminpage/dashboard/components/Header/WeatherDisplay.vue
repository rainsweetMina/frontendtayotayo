<template>
  <span class="weather-display" v-if="weatherList.length > 0">
    {{ weatherList[currentIndex] }}
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callPublicApi } from '@/api/axiosInstance.js'

const weatherList = ref([])
const currentIndex = ref(0)
const apiKey = ref('lIuYX2niKlocef22bmi40PfIT9fT2VuJdhz5wULQUmCMHm4yit0AxNRDUinnB/J9WU/pEOMof3VV11vrnYpUdw==')

// ✔️ 1. 좌표 변환 함수
function convertToGrid(lat, lon) {
  const RE = 6371.00877
  const GRID = 5.0
  const SLAT1 = 30.0, SLAT2 = 60.0
  const OLON = 126.0, OLAT = 38.0
  const XO = 43, YO = 136
  const DEGRAD = Math.PI / 180.0
  const re = RE / GRID
  const slat1 = SLAT1 * DEGRAD, slat2 = SLAT2 * DEGRAD
  const olon = OLON * DEGRAD, olat = OLAT * DEGRAD

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5)
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn)
  let sf = Math.pow(Math.tan(Math.PI * 0.25 + slat1 * 0.5), sn) * Math.cos(slat1) / sn
  let ro = re * sf / Math.pow(Math.tan(Math.PI * 0.25 + olat * 0.5), sn)

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5)
  let ry = re * sf / Math.pow(ra, sn)
  let theta = lon * DEGRAD - olon
  if (theta > Math.PI) theta -= 2.0 * Math.PI
  if (theta < -Math.PI) theta += 2.0 * Math.PI
  theta *= sn

  const x = Math.floor(ry * Math.sin(theta) + XO + 0.5)
  const y = Math.floor(ro - ry * Math.cos(theta) + YO + 0.5)
  return { nx: x, ny: y }
}

function getBaseDateTime() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - 40)
  const yyyyMMdd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = now.getMinutes() < 30 ? '00' : '30'
  return { base_date: yyyyMMdd, base_time: `${hour}${minute}` }
}

function windDirection(degree) {
  const dirs = ['북', '북북동', '북동', '동북동', '동', '동남동', '남동', '남남동', '남', '남남서', '남서', '서남서', '서', '서북서', '북서', '북북서']
  const idx = Math.round((degree % 360) / 22.5) % 16
  return dirs[idx]
}

// CORS 우회를 위한 프록시 URL 생성 함수
function createProxyUrl(url) {
  return `https://cors-anywhere.herokuapp.com/${url}`;
}

// JSONP 방식으로 API 호출하는 함수
function jsonpRequest(url, callback) {
  return new Promise((resolve, reject) => {
    // 콜백 함수 이름 생성 (유니크한 이름)
    const callbackName = 'jsonpCallback_' + Math.round(100000 * Math.random());
    
    // 전역 콜백 함수 등록
    window[callbackName] = function(data) {
      // 스크립트 태그 제거
      document.body.removeChild(script);
      // 전역 콜백 함수 제거
      delete window[callbackName];
      // 데이터 반환
      resolve(data);
    };
    
    // 콜백 파라미터 추가
    const jsonpUrl = url + (url.includes('?') ? '&' : '?') + 'callback=' + callbackName;
    
    // 스크립트 태그 생성 및 추가
    const script = document.createElement('script');
    script.src = jsonpUrl;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// 오늘 날짜를 YYYYMMDD 형식으로 반환하는 함수
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// 현재 시간을 HHMM 형식으로 반환하는 함수
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}${minutes}`;
}

// 날씨 정보 조회 함수
async function fetchWeather() {
  try {
    const { nx, ny } = convertToGrid(35.860533, 128.595014)
    const { base_date, base_time } = getBaseDateTime()

    // 공공 API 호출 (유틸리티 함수 사용)
    const data = await callPublicApi(
      'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0', 
      'getUltraSrtFcst', 
      {
        pageNo: 1,
        numOfRows: 100,
        dataType: 'JSON',
        base_date: base_date,
        base_time: base_time,
        nx: nx,
        ny: ny
      },
      {
        // 인코딩되지 않은 원본 API 키 사용
        apiKey: 'lIuYX2niKlocef22bmi40PfIT9fT2VuJdhz5wULQUmCMHm4yit0AxNRDUinnB/J9WU/pEOMof3VV11vrnYpUdw==',
        // 목업 데이터 제공
        mockData: {
          response: {
            header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
            body: {
              dataType: 'JSON',
              items: {
                item: [
                  { category: 'T1H', fcstValue: '22', fcstDate: getToday(), fcstTime: '1400' },
                  { category: 'SKY', fcstValue: '1', fcstDate: getToday(), fcstTime: '1400' },
                  { category: 'PTY', fcstValue: '0', fcstDate: getToday(), fcstTime: '1400' },
                  { category: 'REH', fcstValue: '60', fcstDate: getToday(), fcstTime: '1400' }
                ]
              }
            }
          }
        }
      }
    );

    const items = data?.response?.body?.items?.item || []

    function getVal(cat) {
      const now = new Date()
      const nowTime = now.getHours() * 100 + (now.getMinutes() < 30 ? 0 : 30)
      const nowFull = parseInt(now.toISOString().slice(0, 10).replace(/-/g, '') + String(nowTime).padStart(4, '0'))

      return items
          .filter(i => i.category === cat)
          .sort((a, b) => {
            const aTime = parseInt(a.fcstDate + a.fcstTime)
            const bTime = parseInt(b.fcstDate + b.fcstTime)
            return Math.abs(aTime - nowFull) - Math.abs(bTime - nowFull)
          })[0]?.fcstValue ?? 'N/A'
    }

    const temp = getVal('T1H')
    const wind = getVal('WSD')
    const sky = getVal('SKY')
    const pty = getVal('PTY')
    const rn1 = getVal('RN1')
    const vec = getVal('VEC')
    const windDir = vec !== 'N/A' ? windDirection(Number(vec)) : 'N/A'

    const skyMap = { '1': '☀️', '3': '⛅', '4': '☁️' }
    const ptyMap = { '0': '', '1': '🌧️', '2': '🌨️', '3': '❄️', '4': '🌦️', '5': '💧' }

    const weatherSymbol = (pty !== '0' && pty !== 'N/A') ? ptyMap[pty] : (skyMap[sky] || '❓')

    const list =
        (vec >= '0' || wind >= '0')
            ? (pty !== '0' && pty !== 'N/A')
                ? [`${temp}℃ ${weatherSymbol}`, `${windDir}풍 ${wind}m/s ${weatherSymbol}`, `강수량: ${rn1} ${weatherSymbol}`]
                : [`${temp}℃ ${weatherSymbol}`, `${windDir}풍 ${wind}m/s ${weatherSymbol}`]
            : (pty !== '0' && pty !== 'N/A')
                ? [`${temp}℃ ${weatherSymbol}`, `강수량: ${rn1} ${weatherSymbol}`]
                : [`${temp}℃ ${weatherSymbol}`]

    weatherList.value = list
  } catch (err) {
    weatherList.value = ['날씨 정보를 불러올 수 없습니다.']
    console.error('날씨 API 오류:', err)
  }
}

onMounted(async () => {
  try {
    await fetchWeather()

    setInterval(fetchWeather, 1000 * 60 * 30)
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % weatherList.value.length
    }, 5000)
  } catch (err) {
    weatherList.value = ['날씨 정보를 불러올 수 없습니다.']
    console.error('날씨 정보 초기화 실패:', err)
  }
})
</script>

<style scoped lang="scss">
.weather-display {
  display: inline-block;
  transition: opacity 0.3s ease;
  opacity: 1;
  color: #333;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.2;
  margin: 0;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

@media (min-width: 640px) {
  .weather-display {
    padding: 0.35rem 0.6rem;
    font-size: 0.95rem;
  }
}
</style>
