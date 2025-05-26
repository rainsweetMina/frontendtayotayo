<template>
  <span class="visible" v-if="weatherList.length > 0">
    {{ weatherList[currentIndex] }}
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const weatherList = ref([])
const currentIndex = ref(0)
const apiKey = ref('')

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

async function fetchWeather() {
  const { nx, ny } = convertToGrid(35.860533, 128.595014)
  const { base_date, base_time } = getBaseDateTime()

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${encodeURIComponent(apiKey.value)}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`

  try {
    const res = await fetch(url)
    const data = await res.json()
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
    const { data } = await axios.get('/api/public/api-key')   // 나중에 여기 주소 수정필요
    apiKey.value = data.apiKey
    await fetchWeather()

    setInterval(fetchWeather, 1000 * 60 * 30)
    setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % weatherList.value.length
    }, 5000)
  } catch (err) {
    weatherList.value = ['API 키 불러오기 실패']
  }
})
</script>

<style scoped>
.visible {
  display: inline-block;
  transition: opacity 0.3s ease;
  color: #dddddd;
  opacity: 1;
}
</style>
