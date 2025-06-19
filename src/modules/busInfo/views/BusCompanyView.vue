<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">버스 회사 조회</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-4">버스 회사 검색</h2>
        <div class="flex gap-2">
          <input 
            type="text" 
            v-model="searchKeyword"
            placeholder="회사명을 입력하세요" 
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            @keyup.enter="searchCompanies"
          />
          <button 
            @click="searchCompanies" 
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
          >
            검색
          </button>
        </div>
      </div>
      
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else>
        <h3 class="text-lg font-medium mb-4">버스 회사 목록</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="company in filteredCompanies" 
            :key="company.id" 
            class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="bg-gray-50 px-4 py-3 border-b">
              <h4 class="font-semibold text-lg">{{ company.name }}</h4>
            </div>
            <div class="p-4">
              <div class="mb-3">
                <p class="text-sm text-gray-600">주소</p>
                <p>{{ company.address }}</p>
              </div>
              <div class="mb-3">
                <p class="text-sm text-gray-600">연락처</p>
                <p>{{ company.phone }}</p>
              </div>
              <div class="mb-3">
                <p class="text-sm text-gray-600">운행 노선</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="route in company.routes" 
                    :key="route" 
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {{ route }}
                  </span>
                </div>
              </div>
              <div class="mt-4">
                <button 
                  @click="viewCompanyDetail(company.id)" 
                  class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  상세보기
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredCompanies.length === 0" class="text-center py-8 text-gray-500">
          검색 결과가 없습니다. 다른 검색어로 다시 시도해보세요.
        </div>
      </div>
    </div>
    
    <!-- 버스 회사 상세 정보 모달 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">{{ selectedCompany.name }}</h2>
            <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">회사 정보</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">주소</p>
                <p class="font-medium">{{ selectedCompany.address }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">연락처</p>
                <p class="font-medium">{{ selectedCompany.phone }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">설립일</p>
                <p class="font-medium">{{ selectedCompany.established }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">대표자</p>
                <p class="font-medium">{{ selectedCompany.ceo }}</p>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">운행 노선</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="route in selectedCompany.routes" 
                :key="route" 
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {{ route }}
              </span>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">보유 차량</h3>
            <p>총 {{ selectedCompany.busCount }}대 (저상버스: {{ selectedCompany.lowFloorBusCount }}대)</p>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-2">운수 종사자 현황</h3>
            <ul class="list-disc pl-5 space-y-1">
              <li>운전기사: {{ selectedCompany.driverCount }}명</li>
              <li>정비사: {{ selectedCompany.mechanicCount }}명</li>
              <li>관리직: {{ selectedCompany.adminCount }}명</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            @click="closeModal" 
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 검색 관련 상태
const searchKeyword = ref('');
const isLoading = ref(false);

// 모달 관련 상태
const showModal = ref(false);
const selectedCompany = ref({});

// 버스 회사 데이터 (임시 데이터)
const companies = [
  { 
    id: '1', 
    name: '대구버스', 
    address: '대구시 중구 중앙대로 123', 
    phone: '053-123-4567',
    established: '1985-03-15',
    ceo: '김대표',
    routes: ['101', '202', '303'],
    busCount: 120,
    lowFloorBusCount: 25,
    driverCount: 150,
    mechanicCount: 20,
    adminCount: 15
  },
  { 
    id: '2', 
    name: '동대구운수', 
    address: '대구시 동구 동대구로 456', 
    phone: '053-456-7890',
    established: '1990-07-22',
    ceo: '이운수',
    routes: ['101', '급행1', '급행2'],
    busCount: 85,
    lowFloorBusCount: 18,
    driverCount: 110,
    mechanicCount: 15,
    adminCount: 12
  },
  { 
    id: '3', 
    name: '북대구교통', 
    address: '대구시 북구 북대구로 789', 
    phone: '053-789-0123',
    established: '1992-11-05',
    ceo: '박교통',
    routes: ['202', '303'],
    busCount: 65,
    lowFloorBusCount: 12,
    driverCount: 80,
    mechanicCount: 10,
    adminCount: 8
  },
  { 
    id: '4', 
    name: '서대구운수', 
    address: '대구시 서구 서대구로 101', 
    phone: '053-321-6547',
    established: '1988-05-10',
    ceo: '최서구',
    routes: ['급행1', '급행2'],
    busCount: 70,
    lowFloorBusCount: 15,
    driverCount: 90,
    mechanicCount: 12,
    adminCount: 10
  },
  { 
    id: '5', 
    name: '남대구버스', 
    address: '대구시 남구 남대구로 222', 
    phone: '053-654-9870',
    established: '1995-09-18',
    ceo: '정남구',
    routes: ['303'],
    busCount: 45,
    lowFloorBusCount: 8,
    driverCount: 60,
    mechanicCount: 8,
    adminCount: 6
  }
];

// 검색어에 따라 필터링된 회사 목록
const filteredCompanies = computed(() => {
  if (!searchKeyword.value) return companies;
  return companies.filter(company => 
    company.name.includes(searchKeyword.value) ||
    company.routes.some(route => route.includes(searchKeyword.value))
  );
});

// 회사 검색 함수
const searchCompanies = async () => {
  isLoading.value = true;
  
  try {
    // API 호출 대신 임시 데이터 사용
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    
    // 실제 API 호출 시 여기서 데이터를 가져오면 됨
    // 현재는 computed로 처리
  } catch (error) {
    console.error('버스 회사 검색 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
};

// 회사 상세 정보 조회
const viewCompanyDetail = (companyId) => {
  selectedCompany.value = companies.find(company => company.id === companyId) || {};
  showModal.value = true;
};

// 모달 닫기
const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* 필요한 경우 여기에 스타일 추가 */
</style> 