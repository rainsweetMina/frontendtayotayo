<template>
  <div class="weather-display" :class="weatherClass">
    <div class="weather-info">
      <div class="weather-header">
        <div class="weather-icon">
          {{ weatherSymbol }}
        </div>
        <h3>오늘의 날씨</h3>
      </div>
      <div class="temperature">{{ temperature }}°C</div>
    </div>
    <div class="weather-details">
      <div class="dust-item">
        <span class="dust-label">미세먼지</span>
        <span class="dust-value" :class="getDustClass(dustStatus)">{{ dustStatus }}</span>
      </div>
      <div class="dust-item">
        <span class="dust-label">초미세</span>
        <span class="dust-value" :class="getDustClass(fineDustStatus)">{{ fineDustStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { jsonpRequest, callPublicApi } from '@/api/axiosInstance.js'

const temperature = ref('--')
const weatherSymbol = ref('☀️')
const dustStatus = ref('보통')
const fineDustStatus = ref('보통')
const apiKey = ref('oDPMcPKGx7dsFyVw5YzReqSK07UuJoUrABe2dbwM7zt9yVfOjSlE7SQtdIir%2BEW%2BDWAcIvio0lm1rR2sMnW7iw%3D%3D')
const airApiKey = ref('j%2FgLHENNg0EDmUOP1OcG5WafUwAUq0u6D1CAZp7xdSTLsSmRJ7r6Pfi34Ks2ZZ7lM0zVZHjjESDToVIX%2BsoPGA%3D%3D')

// 날씨 상태에 따른 클래스 계산
const weatherClass = computed(() => {
  const temp = parseFloat(temperature.value)

  if (isNaN(temp)) return 'weather-normal'

  if (temp >= 30) return 'weather-hot'
  if (temp <= 10) return 'weather-cold'

  // 비/눈이 오는 경우 (weatherSymbol에 따라)
  if (weatherSymbol.value.includes('🌧️') ||
      weatherSymbol.value.includes('🌨️') ||
      weatherSymbol.value.includes('❄️')) {
    return 'weather-rainy'
  }

  return 'weather-normal'
})

// 미세먼지 상태에 따른 클래스 계산
function getDustClass(status) {
  switch(status) {
    case '좋음': return 'dust-good';
    case '보통': return 'dust-normal';
    case '나쁨': return 'dust-bad';
    case '매우나쁨': return 'dust-very-bad';
    default: return '';
  }
}

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

// 기상청 API 호출을 위한 기준 날짜와 시간 계산
function getBaseDateTime() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - 40)
  const yyyyMMdd = now.toISOString().slice(0, 10).replace(/-/g, '')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = now.getMinutes() < 30 ? '00' : '30'
  return { base_date: yyyyMMdd, base_time: `${hour}${minute}` }
}

// 날씨 정보 조회 함수
async function fetchWeather() {
  try {
    const { nx, ny } = convertToGrid(35.860533, 128.595014)
    const { base_date, base_time } = getBaseDateTime()

    try {
      // 공공 API 호출 (유틸리티 함수 사용)
      const data = await callPublicApi(
        'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0', 
        'getUltraSrtFcst', 
        {
          pageNo: 1,
          numOfRows: 100,
          dataType: 'JSON',
          base_date: getToday(),
          base_time: '0500',
          nx: 89,
          ny: 90
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

      console.log('날씨 API 응답 데이터:', data);

      if (data?.response?.body?.items?.item) {
        const items = data.response.body.items.item

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
        const sky = getVal('SKY')
        const pty = getVal('PTY')

        const skyMap = { '1': '☀️', '3': '⛅', '4': '☁️' }
        const ptyMap = { '0': '', '1': '🌧️', '2': '🌨️', '3': '❄️', '4': '🌦️', '5': '💧' }

        weatherSymbol.value = (pty !== '0' && pty !== 'N/A') ? ptyMap[pty] : (skyMap[sky] || '❓')
        temperature.value = temp !== 'N/A' ? temp : '--'
      } else {
        throw new Error('데이터가 비어 있거나 형식이 다릅니다.')
      }
    } catch (error) {
      console.warn('날씨 API 호출 실패, 목업 데이터 사용:', error)
      const currentHour = new Date().getHours()
      weatherSymbol.value = currentHour >= 6 && currentHour < 18 ? '☀️' : '🌙'
      temperature.value = currentHour >= 6 && currentHour < 18 ? '22' : '18'
    }

    // 미세먼지 정보 가져오기
    try {
      await fetchAirQuality()
    } catch (err) {
      console.warn('미세먼지 정보 가져오기 실패, 기본값 유지:', err)
      // 오류 시 기본값 유지
      dustStatus.value = '보통'
      fineDustStatus.value = '좋음'
    }
  } catch (err) {
    console.error('날씨 API 오류:', err)
    temperature.value = '--'
    weatherSymbol.value = '❓'
  }
}

// 미세먼지 정보 조회 함수
async function fetchAirQuality() {
  try {
    // 공공 API 호출 (유틸리티 함수 사용)
    const data = await callPublicApi(
      'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc', 
      'getMsrstnAcctoRltmMesureDnsty', 
      {
        returnType: 'json',
        numOfRows: 1,
        pageNo: 1,
        stationName: '중구',
        dataTerm: 'DAILY',
        ver: '1.3'
      },
      {
        // 인코딩되지 않은 원본 API 키 사용
        apiKey: 'oDPMcPKGx7dsFyVw5YzReqSK07UuJoUrABe2dbwM7zt9yVfOjSlE7SQtdIir%2BEW%2BDWAcIvio0lm1rR2sMnW7iw%3D%3D',
        // 목업 데이터 제공
        mockData: {
          response: {
            body: {
              items: [
                {
                  pm10Value: '45',
                  pm25Value: '25',
                  pm10Grade: '2',
                  pm25Grade: '2',
                  dataTime: new Date().toISOString().split('T')[0]
                }
              ]
            }
          }
        }
      }
    );
    
    if (data?.response?.body?.items) {
      const airData = data.response.body.items[0]
      
      // 미세먼지(PM10) 등급 변환
      const pm10Grade = airData.pm10Grade1h || airData.pm10Grade
      if (pm10Grade) {
        switch (pm10Grade) {
          case '1': dustStatus.value = '좋음'; break
          case '2': dustStatus.value = '보통'; break
          case '3': dustStatus.value = '나쁨'; break
          case '4': dustStatus.value = '매우나쁨'; break
          default: dustStatus.value = '보통'
        }
      }
      
      // 초미세먼지(PM2.5) 등급 변환
      const pm25Grade = airData.pm25Grade1h || airData.pm25Grade
      if (pm25Grade) {
        switch (pm25Grade) {
          case '1': fineDustStatus.value = '좋음'; break
          case '2': fineDustStatus.value = '보통'; break
          case '3': fineDustStatus.value = '나쁨'; break
          case '4': fineDustStatus.value = '매우나쁨'; break
          default: fineDustStatus.value = '보통'
        }
      }
      
      console.log('미세먼지 정보 조회 성공:', airData)
    } else {
      throw new Error('미세먼지 데이터 형식 오류')
    }
  } catch (error) {
    console.warn('미세먼지 API 직접 호출 실패, 목업 데이터 사용:', error)
    
    // 목업 데이터 설정
    dustStatus.value = '보통'
    fineDustStatus.value = '좋음'
  }
}

onMounted(async () => {
  try {
    await fetchWeather()
    // 오류 발생 시에도 계속 시도하도록 설정
    setInterval(fetchWeather, 1000 * 60 * 30) // 30분마다 갱신
  } catch (err) {
    console.error('날씨 정보 초기화 실패:', err)
    // 오류 발생해도 타이머는 계속 실행
    setInterval(fetchWeather, 1000 * 60 * 30) // 30분마다 갱신
  }
})
</script>

<style scoped lang="scss">
.weather-display {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  transition: background 0.5s ease;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.weather-normal {
  background: linear-gradient(120deg, #0d4f96, #56b4f3, #56b4f3);
  box-shadow: 0 4px 15px rgba(13, 79, 150, 0.4);
}

.weather-hot {
  background: linear-gradient(120deg, #e74c3c, #ffb347, #ffb347);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.weather-cold {
  background: linear-gradient(120deg, #1a56cc, #90caf9, #90caf9);
  box-shadow: 0 4px 15px rgba(26, 86, 204, 0.4);
}

.weather-rainy {
  background: linear-gradient(120deg, #37474f, #78909c, #78909c);
  box-shadow: 0 4px 15px rgba(55, 71, 79, 0.4);
}

.weather-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0 8px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.weather-icon {
  font-size: 1.8rem;
}

.temperature {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
}

.weather-details {
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
}

.dust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dust-label {
  font-size: 0.8rem;
  margin-bottom: 4px;
  opacity: 0.9;
}

.dust-value {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}

.dust-good {
  background-color: #58B19F;
}

.dust-normal {
  background-color: #3498DB;
}

.dust-bad {
  background-color: #E67E22;
}

.dust-very-bad {
  background-color: #E74C3C;
}
</style> 