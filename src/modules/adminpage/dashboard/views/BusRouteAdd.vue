<template>
<!--  <div>-->
<!--    <div class="flex justify-between items-center mb-6">-->
<!--      <h1 class="text-2xl font-semibold text-gray-900">노선 추가</h1>-->
<!--    </div>-->

<!--    <div class="bg-white shadow rounded-lg p-6">-->
<!--      <form @submit.prevent="handleSubmit">-->
<!--        &lt;!&ndash; 노선 기본 정보 &ndash;&gt;-->
<!--        <div class="space-y-6">-->
<!--          <div>-->
<!--            <h2 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>-->
<!--            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">-->
<!--              <div>-->
<!--                <label for="routeNumber" class="block text-sm font-medium text-gray-700">노선 번호</label>-->
<!--                <input-->
<!--                  type="text"-->
<!--                  id="routeNumber"-->
<!--                  v-model="form.routeNumber"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="routeName" class="block text-sm font-medium text-gray-700">노선명</label>-->
<!--                <input-->
<!--                  type="text"-->
<!--                  id="routeName"-->
<!--                  v-model="form.routeName"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="routeType" class="block text-sm font-medium text-gray-700">노선 유형</label>-->
<!--                <select-->
<!--                  id="routeType"-->
<!--                  v-model="form.routeType"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                >-->
<!--                  <option value="">선택하세요</option>-->
<!--                  <option value="일반">일반</option>-->
<!--                  <option value="급행">급행</option>-->
<!--                  <option value="심야">심야</option>-->
<!--                </select>-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="company" class="block text-sm font-medium text-gray-700">운수 회사</label>-->
<!--                <select-->
<!--                  id="company"-->
<!--                  v-model="form.company"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                >-->
<!--                  <option value="">선택하세요</option>-->
<!--                  <option v-for="company in companies" :key="company.id" :value="company.id">-->
<!--                    {{ company.name }}-->
<!--                  </option>-->
<!--                </select>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 운행 정보 &ndash;&gt;-->
<!--          <div>-->
<!--            <h2 class="text-lg font-medium text-gray-900 mb-4">운행 정보</h2>-->
<!--            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">-->
<!--              <div>-->
<!--                <label for="firstBus" class="block text-sm font-medium text-gray-700">첫차 시간</label>-->
<!--                <input-->
<!--                  type="time"-->
<!--                  id="firstBus"-->
<!--                  v-model="form.firstBus"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="lastBus" class="block text-sm font-medium text-gray-700">막차 시간</label>-->
<!--                <input-->
<!--                  type="time"-->
<!--                  id="lastBus"-->
<!--                  v-model="form.lastBus"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="interval" class="block text-sm font-medium text-gray-700">배차 간격 (분)</label>-->
<!--                <input-->
<!--                  type="number"-->
<!--                  id="interval"-->
<!--                  v-model="form.interval"-->
<!--                  min="1"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--              <div>-->
<!--                <label for="fare" class="block text-sm font-medium text-gray-700">기본 요금</label>-->
<!--                <input-->
<!--                  type="number"-->
<!--                  id="fare"-->
<!--                  v-model="form.fare"-->
<!--                  min="0"-->
<!--                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--                  required-->
<!--                />-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash; 비고 &ndash;&gt;-->
<!--          <div>-->
<!--            <label for="notes" class="block text-sm font-medium text-gray-700">비고</label>-->
<!--            <textarea-->
<!--              id="notes"-->
<!--              v-model="form.notes"-->
<!--              rows="3"-->
<!--              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"-->
<!--            ></textarea>-->
<!--          </div>-->
<!--        </div>-->

<!--        &lt;!&ndash; 버튼 &ndash;&gt;-->
<!--        <div class="mt-6 flex items-center justify-end space-x-4">-->
<!--          <button-->
<!--            type="button"-->
<!--            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"-->
<!--            @click="$router.back()"-->
<!--          >-->
<!--            취소-->
<!--          </button>-->
<!--          <button-->
<!--            type="submit"-->
<!--            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"-->
<!--          >-->
<!--            노선 추가-->
<!--          </button>-->
<!--        </div>-->
<!--      </form>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script setup>
// import { ref, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
//
// const router = useRouter()
// const companies = ref([])
//
// const form = ref({
//   routeNumber: '',
//   routeName: '',
//   routeType: '',
//   company: '',
//   firstBus: '',
//   lastBus: '',
//   interval: '',
//   fare: '',
//   notes: ''
// })
//
// // 운수 회사 목록 가져오기
// const fetchCompanies = async () => {
//   try {
//     const response = await fetch('/api/admin/companies')
//     const data = await response.json()
//     companies.value = data.companies
//   } catch (error) {
//     console.error('운수 회사 데이터 로딩 실패:', error)
//   }
// }
//
// // 폼 제출 처리
// const handleSubmit = async () => {
//   try {
//     const response = await fetch('/api/admin/bus-routes', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(form.value)
//     })
//
//     if (response.ok) {
//       alert('노선이 성공적으로 추가되었습니다.')
//       router.push('/admin/bus-routes')
//     } else {
//       const error = await response.json()
//       alert(`노선 추가 실패: ${error.message}`)
//     }
//   } catch (error) {
//     console.error('노선 추가 실패:', error)
//     alert('노선 추가 중 오류가 발생했습니다.')
//   }
// }
//
// onMounted(() => {
//   fetchCompanies()
// })
</script>