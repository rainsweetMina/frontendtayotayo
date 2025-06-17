<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">버스 요금 안내</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">일반 버스 요금</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th class="py-3 px-4 text-left">구분</th>
              <th class="py-3 px-4 text-left">현금</th>
              <th class="py-3 px-4 text-left">교통카드</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr class="border-b">
              <td class="py-3 px-4">일반</td>
              <td class="py-3 px-4">1,400원</td>
              <td class="py-3 px-4">1,300원</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 px-4">청소년</td>
              <td class="py-3 px-4">1,120원</td>
              <td class="py-3 px-4">1,040원</td>
            </tr>
            <tr>
              <td class="py-3 px-4">어린이</td>
              <td class="py-3 px-4">700원</td>
              <td class="py-3 px-4">650원</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="text-sm text-gray-600 mt-4">※ 만 6세 미만 어린이, 만 65세 이상 노인, 장애인은 무료입니다.</p>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">환승 안내</h2>
      
      <ul class="list-disc pl-5 space-y-2">
        <li>환승은 교통카드 사용 시에만 가능합니다.</li>
        <li>하차 후 30분 이내에 다른 버스나 지하철로 환승 시 추가 요금이 부과되지 않습니다.</li>
        <li>최대 2회까지 환승 할인이 적용됩니다.</li>
        <li>동일 노선 환승은 할인이 적용되지 않습니다.</li>
      </ul>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">정기권 요금</h2>
      
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th class="py-3 px-4 text-left">구분</th>
              <th class="py-3 px-4 text-left">1개월</th>
              <th class="py-3 px-4 text-left">3개월</th>
              <th class="py-3 px-4 text-left">6개월</th>
            </tr>
          </thead>
          <tbody class="text-gray-700">
            <tr class="border-b">
              <td class="py-3 px-4">일반</td>
              <td class="py-3 px-4">55,000원</td>
              <td class="py-3 px-4">150,000원</td>
              <td class="py-3 px-4">280,000원</td>
            </tr>
            <tr class="border-b">
              <td class="py-3 px-4">청소년</td>
              <td class="py-3 px-4">44,000원</td>
              <td class="py-3 px-4">120,000원</td>
              <td class="py-3 px-4">224,000원</td>
            </tr>
            <tr>
              <td class="py-3 px-4">어린이</td>
              <td class="py-3 px-4">27,500원</td>
              <td class="py-3 px-4">75,000원</td>
              <td class="py-3 px-4">140,000원</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p class="text-sm text-gray-600 mt-4">※ 정기권은 교통카드 충전소에서 구매 가능합니다.</p>
    </div>
  </div>
</template>

<script setup>
// 필요한 경우 여기에 스크립트 추가
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style> 