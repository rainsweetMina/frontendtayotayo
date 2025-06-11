<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">시스템 로그</h1>
      <div class="flex space-x-4 items-center">
        <!-- 검색 필드 추가 -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="로그 검색 또는 ID..."
            class="w-96 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            @keyup.enter="searchLogs"
          />
          <button 
            @click="searchLogs"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        <select
          v-model="logLevel"
          class="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="all">전체</option>
          <option value="create">등록/생성</option>
          <option value="update">수정/변경</option>
          <option value="delete">삭제</option>
          <option value="view">조회/검색</option>
          <option value="bus">버스 관련</option>
        </select>
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="downloadLogs"
          >
            로그 다운로드
          </button>
        </div>
      </div>
    </div>

    <!-- 디버그 정보 -->
    <div v-if="debugMode" class="mb-4 p-4 bg-gray-100 rounded-md">
      <h3 class="font-medium text-gray-900 mb-2">디버그 정보</h3>
      <div class="text-sm">
        <p>총 로그 수: {{ logs.length }}</p>
        <p>필터링된 로그 수: {{ filteredLogs.length }}</p>
        <p>현재 페이지: {{ currentPage }} / {{ totalPages }}</p>
        <p>현재 필터: {{ logLevel }}</p>
        <p>검색어: {{ searchQuery || '없음' }}</p>
      </div>
      <div class="mt-2">
        <button 
          class="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
          @click="fetchLogById(1134)"
        >
          ID 1134 로그 직접 검색
        </button>
      </div>
    </div>

    <!-- 로그 목록 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="filteredLogs.length === 0" class="p-8 text-center text-gray-500">
        표시할 로그가 없습니다. 다른 필터를 선택하거나 다른 페이지를 확인해보세요.
        <div class="mt-4">
          <button 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            @click="debugMode = !debugMode"
          >
            {{ debugMode ? '디버그 모드 끄기' : '디버그 모드 켜기' }}
          </button>
        </div>
      </div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="(log, index) in filteredLogs" :key="log.id || index" class="p-4 hover:bg-gray-50">
          <div class="flex items-start">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 mt-1',
                getLogLevelClass(log.action)
              ]"
            >
              {{ getActionLabel(log.action) }}
            </span>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-sm text-gray-700 font-medium">
                    {{ getLogSummary(log) }}
                  </span>
                  <span class="ml-2 text-xs text-gray-500">
                    (ID: {{ log.id }})
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <span class="mr-3">{{ log.adminId || '시스템' }}</span>
                  <span>{{ formatDateTime(log.timestamp) }}</span>
                </div>
              </div>
              
              <div class="mt-2 flex items-center">
                <div 
                  class="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 w-full"
                >
                  <!-- 요약 정보 카드 -->
                  <div class="flex flex-wrap gap-2">
                    <div v-if="log.target" class="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                      대상: {{ log.target }}
                    </div>
                    <div v-if="log.adminId" class="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs">
                      관리자: {{ log.adminId }}
                    </div>
                    <div class="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs">
                      시간: {{ formatShortDateTime(log.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="log.beforeValue || log.afterValue" class="mt-3 ml-10">
            <button
              class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              @click="log.isExpanded = !log.isExpanded"
            >
              <span class="mr-1">{{ log.isExpanded ? '상세 정보 접기' : '상세 정보 보기' }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-4 w-4" 
                :class="{ 'transform rotate-180': log.isExpanded }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="log.isExpanded"
              class="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 transition-all duration-200"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="log.beforeValue && log.afterValue">
                  <div class="font-semibold text-gray-700 mb-1 pb-1 border-b">변경 전:</div>
                  <pre class="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">{{ formatJsonValue(log.beforeValue) }}</pre>
                </div>
                <div v-else-if="log.beforeValue">
                  <div class="font-semibold text-gray-700 mb-1 pb-1 border-b">이전 데이터:</div>
                  <pre class="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">{{ formatJsonValue(log.beforeValue) }}</pre>
                </div>
                <div v-if="log.afterValue">
                  <div class="font-semibold text-gray-700 mb-1 pb-1 border-b">
                    {{ log.beforeValue ? '변경 후:' : '데이터:' }}
                  </div>
                  <pre class="whitespace-pre-wrap font-mono text-xs overflow-auto max-h-60 p-2 bg-gray-100 rounded">{{ formatJsonValue(log.afterValue) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="flex justify-center mt-6" v-if="totalPages > 0">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          이전
        </button>
        <button
          v-for="page in availablePages"
          :key="page"
          :class="[
            'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium',
            currentPage === page
              ? 'text-blue-600 border-blue-500'
              : 'text-gray-700 hover:bg-gray-50'
          ]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :disabled="currentPage === Math.max(...availablePages) || availablePages.length === 0"
          @click="changePage(currentPage + 1)"
        >
          다음
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

// 상태 데이터
const logs = ref([])
const searchQuery = ref('')
const debugMode = ref(false)
const filteredLogs = computed(() => {
  let result = logs.value;
  
  // 검색어 필터링
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase();
    // ID로 정확히 검색하는 경우
    if (/^\d+$/.test(query)) {
      result = result.filter(log => log.id && log.id.toString() === query);
    } else {
      // 텍스트 검색
      result = result.filter(log => {
        // 'anonymousUser'와 'user'를 제외하고 admin만 검색
        if (log.adminId && (log.adminId.toLowerCase() === 'anonymoususer' || log.adminId.toLowerCase() === 'user')) {
          return false;
        }
        
        return (
          (log.action && log.action.toLowerCase().includes(query)) ||
          (log.target && log.target.toLowerCase().includes(query)) ||
          (log.adminId && log.adminId.toLowerCase().includes(query)) ||
          (log.beforeValue && log.beforeValue.toLowerCase().includes(query)) ||
          (log.afterValue && log.afterValue.toLowerCase().includes(query))
        );
      });
    }
  }
  
  // 로그 레벨 필터링
  if (logLevel.value !== 'all') {
    if (logLevel.value === 'bus') {
      // 버스 관련 로그만 필터링 (대소문자 무관하게 검색)
      return result.filter(log => 
        (log.action && log.action.toLowerCase().includes('버스')) || 
        (log.target && (
          log.target.toLowerCase().includes('bus') || 
          log.target.toLowerCase().includes('버스')
        )) ||
        // 데이터 필드에서도 버스 관련 검색
        (log.beforeValue && (
          log.beforeValue.toLowerCase().includes('bus') || 
          log.beforeValue.toLowerCase().includes('버스')
        )) ||
        (log.afterValue && (
          log.afterValue.toLowerCase().includes('bus') || 
          log.afterValue.toLowerCase().includes('버스')
        ))
      );
    }
    
    return result.filter(log => {
      const action = log.action || '';
      
      if (logLevel.value === 'create' && (
        action.includes('등록') || 
        action.includes('생성') || 
        action.includes('추가') ||
        action.includes('create')
      )) {
        return true;
      } else if (logLevel.value === 'update' && (
        action.includes('수정') || 
        action.includes('변경') || 
        action.includes('업데이트') ||
        action.includes('update')
      )) {
        return true;
      } else if (logLevel.value === 'delete' && (
        action.includes('삭제') || 
        action.includes('제거') ||
        action.includes('delete')
      )) {
        return true;
      } else if (logLevel.value === 'view' && (
        action.includes('조회') || 
        action.includes('검색') || 
        action.includes('확인') || 
        action.includes('전체') ||
        action.includes('view')
      )) {
        return true;
      }
      
      return false;
    });
  }
  
  return result;
});
const currentPage = ref(1)
const totalPages = ref(1)
const logLevel = ref('all')

// 데이터가 있는 페이지 계산
const availablePages = ref([])

// 페이지 데이터 확인 함수
const updateAvailablePages = () => {
  console.log('데이터가 있는 페이지 계산 중...');
  // 사용 가능한 페이지 초기화
  availablePages.value = [];
  
  // 페이지 수가 1 이하면 첫 페이지만 추가
  if (totalPages.value <= 1) {
    availablePages.value.push(1);
    return;
  }
  
  // 모든 페이지 추가
  for (let i = 1; i <= totalPages.value; i++) {
    availablePages.value.push(i);
  }
  
  // 정렬
  availablePages.value.sort((a, b) => a - b);
  console.log('사용 가능한 페이지:', availablePages.value);
}

// 검색 기능
const searchLogs = () => {
  console.log('검색어로 필터링:', searchQuery.value);
  
  // ID로 검색하는 경우 (숫자만 입력된 경우)
  if (/^\d+$/.test(searchQuery.value.trim())) {
    const logId = parseInt(searchQuery.value.trim());
    console.log('로그 ID로 검색:', logId);
    
    // 모든 페이지에서 해당 ID 검색을 위해 직접 API 호출
    fetchLogById(logId);
  }
}

// ID로 로그 검색
const fetchLogById = async (id) => {
  try {
    console.log(`ID ${id}로 로그 검색 중...`);
    // 로그를 직접 가져오는 API 호출 (페이지네이션 없이)
    const response = await fetch(`/api/admin/logs/id/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        alert(`ID가 ${id}인 로그를 찾을 수 없습니다.`);
        return;
      }
      const errorText = await response.text();
      console.error(`오류 응답 (${response.status}):`, errorText);
      throw new Error(`서버 응답 오류 ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();
    console.log(`ID ${id} 검색 응답:`, responseText);
    
    // 응답이 없거나 빈 경우
    if (!responseText || responseText.trim() === '') {
      alert(`ID가 ${id}인 로그를 찾을 수 없습니다.`);
      return;
    }
    
    // XML 처리
    if (contentType && contentType.includes("application/xml") || responseText.trim().startsWith('<')) {
      // XML 응답 처리
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, "text/xml");
      
      // 단일 로그 객체 생성
      const log = {};
      const fields = ['id', 'adminId', 'action', 'target', 'beforeValue', 'afterValue', 'timestamp'];
      
      fields.forEach(field => {
        const elements = xmlDoc.getElementsByTagName(field);
        if (elements.length > 0) {
          log[field] = elements[0].textContent;
        } else {
          log[field] = field === 'beforeValue' || field === 'afterValue' ? '{}' : null;
        }
      });
      
      if (log.id) {
        // 찾은 로그를 표시
        logs.value = [{...log, isExpanded: false}];
        totalPages.value = 1;
        alert(`ID ${id}인 로그를 찾았습니다!`);
      } else {
        alert(`ID가 ${id}인 로그를 찾을 수 없습니다.`);
      }
    } 
    // JSON 처리
    else {
      try {
        const data = JSON.parse(responseText);
        if (data && data.id) {
          logs.value = [{...data, isExpanded: false}];
          totalPages.value = 1;
          alert(`ID ${id}인 로그를 찾았습니다!`);
        } else {
          alert(`ID가 ${id}인 로그를 찾을 수 없습니다.`);
        }
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        alert('응답을 파싱할 수 없습니다.');
      }
    }
  } catch (error) {
    console.error('로그 ID 검색 실패:', error);
    alert(`로그 검색 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 전체 데이터 직접 로드 (페이지네이션 없이)
const loadAllLogs = async () => {
  try {
    console.log('모든 로그 데이터 로드 중...');
    const response = await fetch(`/api/admin/logs/all`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`오류 응답 (${response.status}):`, errorText);
      throw new Error(`서버 응답 오류 ${response.status}: ${errorText}`);
    }
    
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();
    
    let allLogs = [];
    
    // XML 처리
    if (contentType && contentType.includes("application/xml") || responseText.trim().startsWith('<')) {
      console.log('XML 전체 로그 응답 감지');
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, "text/xml");
      
      // 모든 로그 요소 가져오기
      const logElements = xmlDoc.getElementsByTagName('item');
      
      if (logElements.length === 0) {
        // 다른 형식의 XML 구조 시도
        const contentElements = xmlDoc.getElementsByTagName('content');
        
        for (let i = 0; i < contentElements.length; i++) {
          const content = contentElements[i];
          const log = {};
          
          // 각 필드 추출
          const fields = ['id', 'adminId', 'action', 'target', 'beforeValue', 'afterValue', 'timestamp'];
          fields.forEach(field => {
            const elements = content.getElementsByTagName(field);
            if (elements.length > 0) {
              log[field] = elements[0].textContent;
            } else {
              log[field] = field === 'beforeValue' || field === 'afterValue' ? '{}' : null;
            }
          });
          
          allLogs.push(log);
        }
      } else {
        // 기본 XML 구조 처리
        for (let i = 0; i < logElements.length; i++) {
          const item = logElements[i];
          const log = {};
          
          // 각 필드 추출
          const fields = ['id', 'adminId', 'action', 'target', 'beforeValue', 'afterValue', 'timestamp'];
          fields.forEach(field => {
            const elements = item.getElementsByTagName(field);
            if (elements.length > 0) {
              log[field] = elements[0].textContent;
            } else {
              log[field] = field === 'beforeValue' || field === 'afterValue' ? '{}' : null;
            }
          });
          
          allLogs.push(log);
        }
      }
    } 
    // JSON 처리
    else {
      try {
        const data = JSON.parse(responseText);
        if (Array.isArray(data)) {
          allLogs = data;
        } else if (data && Array.isArray(data.content)) {
          allLogs = data.content;
        }
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        throw new Error('응답을 JSON으로 파싱할 수 없습니다');
      }
    }
    
    console.log(`총 ${allLogs.length}개의 로그를 로드했습니다.`);
    
    // 버스 관련 로그 찾기
    const busLogs = allLogs.filter(log => 
      (log.action && log.action.toLowerCase().includes('버스')) || 
      (log.target && log.target.toLowerCase().includes('bus'))
    );
    
    console.log(`버스 관련 로그 ${busLogs.length}개 발견:`, busLogs);
    
    // 특정 ID 로그 직접 찾기
    const log1134 = allLogs.find(log => log.id === 1134 || log.id === '1134');
    if (log1134) {
      console.log('ID 1134 로그 발견:', log1134);
      alert('ID 1134 로그를 찾았습니다! 콘솔을 확인하세요.');
    } else {
      console.log('ID 1134 로그를 찾을 수 없습니다.');
    }
    
    if (busLogs.length > 0) {
      logs.value = busLogs.map(log => ({...log, isExpanded: false}));
      totalPages.value = 1;
      logLevel.value = 'bus';
      alert(`${busLogs.length}개의 버스 관련 로그를 찾았습니다!`);
    } else {
      alert('버스 관련 로그를 찾을 수 없습니다.');
    }
    
  } catch (error) {
    console.error('전체 로그 로드 실패:', error);
    alert(`로그 로드 중 오류가 발생했습니다: ${error.message}`);
  }
}

// 데이터 가져오기
const fetchLogs = async (page) => {
  try {
    // 원래 API 엔드포인트 사용 (페이지 번호를 0부터 시작하도록 변경)
    const response = await fetch(
      `/api/admin/logs?page=${page-1}&size=20`
    )
    
    // HTTP 상태 코드 확인
    if (!response.ok) {
      // 응답이 성공적이지 않은 경우, 텍스트로 오류 메시지를 가져옴
      const errorText = await response.text();
      console.error(`오류 응답 (${response.status}):`, errorText);
      throw new Error(`서버 응답 오류 ${response.status}: ${errorText}`);
    }
    
    // 응답 타입 확인
    const contentType = response.headers.get("content-type");
    const responseText = await response.text();
    console.log('응답 데이터 원본:', responseText.substring(0, 200) + '...');
    
    let data;
    
    // XML 응답 처리
    if (contentType && contentType.includes("application/xml") || responseText.trim().startsWith('<')) {
      console.log('XML 응답 감지됨');
      
      // XML 파싱 (간단한 방식)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, "text/xml");
      
      // 로그 항목 추출
      const contentElements = xmlDoc.getElementsByTagName('content');
      const parsedLogs = [];
      
      for (let i = 0; i < contentElements.length; i++) {
        const content = contentElements[i];
        const log = {};
        
        // 각 필드 추출
        const fields = ['id', 'adminId', 'action', 'target', 'beforeValue', 'afterValue', 'timestamp'];
        fields.forEach(field => {
          const elements = content.getElementsByTagName(field);
          if (elements.length > 0) {
            // 빈 태그 처리 (<afterValue/> 같은 형식)
            if (elements[0].textContent === '' && !elements[0].hasChildNodes()) {
              if (field === 'beforeValue' || field === 'afterValue') {
                log[field] = '{}';
              } else {
                log[field] = '';
              }
            } else {
              log[field] = elements[0].textContent;
            }
          } else {
            if (field === 'beforeValue' || field === 'afterValue') {
              log[field] = '{}';
            } else {
              log[field] = null;
            }
          }
        });
        
        parsedLogs.push(log);
      }
      
      // 전체 페이지 수 추출 (가능한 경우)
      let totalPagesValue = 1;
      const totalPagesElements = xmlDoc.getElementsByTagName('totalPages');
      if (totalPagesElements.length > 0) {
        totalPagesValue = parseInt(totalPagesElements[0].textContent) || 1;
      }
      
      // 각 페이지에 데이터가 있는지 확인하기 위한 totalElements 추출
      let totalElements = 0;
      const totalElementsNodes = xmlDoc.getElementsByTagName('totalElements');
      if (totalElementsNodes.length > 0) {
        totalElements = parseInt(totalElementsNodes[0].textContent) || 0;
      }
      
      // 데이터 설정
      data = {
        content: parsedLogs,
        totalPages: totalPagesValue,
        totalElements: totalElements
      };
      
      console.log('파싱된 XML 데이터:', data);
    } 
    // JSON 응답 처리
    else if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
        console.log('JSON 응답 파싱됨:', data);
      } catch (e) {
        console.error('JSON 파싱 오류:', e);
        throw new Error('서버 응답을 JSON으로 파싱할 수 없습니다');
      }
    } 
    // 기타 응답 형식
    else {
      console.error("지원되지 않는 응답 형식:", contentType);
      throw new Error("서버에서 지원되지 않는 응답 형식이 반환되었습니다");
    }
    
    // 디버깅용 정보 출력
    console.log('파싱된 데이터:', data);
    if (data && data.content && data.content.length > 0) {
      console.log('로그 항목의 첫 번째 데이터 구조:', data.content[0]);
      console.log('로그 항목의 첫 번째 객체 키:', Object.keys(data.content[0]));
    }
    
    // 응답 형식 처리 (data.content에 실제 로그 데이터가 있음)
    if (data && Array.isArray(data.content)) {
      // user와 anonymousUser 로그를 필터링하고, 버스 회사 조회 로그도 제외
      const filteredContent = data.content.filter(log => {
        // user와 anonymousUser 제외
        if (log.adminId && 
          (log.adminId.toLowerCase() === 'anonymoususer' || 
           log.adminId.toLowerCase() === 'user')) {
          return false;
        }
        
        // 버스 회사 조회 로그 제외
        if (log.action && log.target && 
            (log.action.includes('조회') || log.action.includes('확인') || log.action.includes('검색')) && 
            (log.target.includes('버스') || log.target.includes('Bus') || log.target.includes('bus') || 
             log.target.includes('BusCompany') || log.target.includes('버스회사'))) {
          return false;
        }
        
        return true;
      });
      
      logs.value = filteredContent.map(log => ({
        ...log,
        isExpanded: false,
      }))
      
      // 필터링된 로그를 기준으로 페이지 수 다시 계산
      const pageSize = 20; // 페이지당 로그 수
      totalPages.value = Math.ceil(filteredContent.length / pageSize) || 1;
      
      console.log('필터링 후 로그 수:', filteredContent.length);
      console.log('다시 계산된 페이지 수:', totalPages.value);
      
      // 현재 페이지가 새로운 총 페이지 수보다 크면 첫 페이지로 이동
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
      
      // 사용 가능한 페이지 업데이트
      updateAvailablePages();
    } 
    else if (Array.isArray(data)) {
      // 데이터가 직접 배열로 오는 경우
      logs.value = data.map(log => ({
        ...log,
        isExpanded: false,
      }));
      totalPages.value = data.length > 0 ? Math.ceil(data.length / 10) : 1;
    }
    else {
      console.error('예상하지 못한 데이터 형식:', data);
      throw new Error('서버 응답 데이터 구조가 예상과 다릅니다');
    }
  } catch (error) {
    console.error('시스템 로그 데이터 로딩 실패:', error)
    logs.value = [] // 오류 시 로그 목록 초기화
    totalPages.value = 1 // 오류 시 페이지 수 초기화
    
    // 사용자에게 오류 표시 (선택적으로 alert 또는 다른 UI 요소 사용)
    alert('시스템 로그를 불러오는 중 오류가 발생했습니다: ' + error.message)
  }
}

// JSON 값 포맷팅
const formatJsonValue = (value) => {
  if (!value) return '';
  if (value === '{}') return '데이터 없음';
  
  try {
    // 중첩된 JSON 문자열 처리 시도
    let parsed = JSON.parse(value);
    
    // arg0, arg1 형식인 경우 추가 파싱 시도
    if (typeof parsed === 'object' && (parsed.arg0 || parsed.arg1)) {
      try {
        if (parsed.arg0 && parsed.arg0 !== "null" && typeof parsed.arg0 === 'string') {
          parsed.arg0 = JSON.parse(parsed.arg0);
        }
      } catch (e) {
        // 파싱 실패해도 계속 진행
      }
      
      try {
        if (parsed.arg1 && parsed.arg1 !== "null" && typeof parsed.arg1 === 'string') {
          parsed.arg1 = JSON.parse(parsed.arg1);
        }
      } catch (e) {
        // 파싱 실패해도 계속 진행
      }
    }
    
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // JSON 파싱에 실패하면 원본 문자열 반환
    return value;
  }
}

// 로그 데이터 요약 생성
const getLogSummary = (log) => {
  if (!log) return '';
  
  let summary = '';
  
  if (log.action && log.target) {
    if (log.action.includes('등록')) {
      summary = `${log.target} 등록`;
    } else if (log.action.includes('삭제')) {
      summary = `${log.target} 삭제`;
    } else if (log.action.includes('수정')) {
      summary = `${log.target} 수정`;
    } else {
      summary = `${log.action}: ${log.target}`;
    }
  } else {
    summary = log.action || log.target || '시스템 로그';
  }
  
  return summary;
}

// 페이지 변경
const changePage = (page) => {
  // 유효한 페이지인지 확인
  if (!availablePages.value.includes(page)) {
    const closestPage = availablePages.value.reduce((prev, curr) => {
      return Math.abs(curr - page) < Math.abs(prev - page) ? curr : prev;
    }, availablePages.value[0] || 1);
    
    page = closestPage;
  }
  
  currentPage.value = page
  fetchLogs(page)
}

// 로그 레벨에 따른 스타일 클래스
const getLogLevelClass = (action) => {
  if (!action) return 'bg-gray-100 text-gray-800';
  
  // 액션 유형에 따른 스타일 분류
  if (action.includes('등록') || action.includes('생성') || action.includes('추가')) {
    return 'bg-green-100 text-green-800'; // CREATE
  } else if (action.includes('삭제') || action.includes('제거')) {
    return 'bg-red-100 text-red-800'; // DELETE
  } else if (action.includes('수정') || action.includes('변경') || action.includes('업데이트')) {
    return 'bg-orange-100 text-orange-800'; // UPDATE
  } else if (action.includes('조회') || action.includes('검색') || action.includes('확인') || action.includes('전체')) {
    return 'bg-blue-100 text-blue-800'; // VIEW
  } else {
    return 'bg-purple-100 text-purple-800'; // OTHER
  }
}

// 액션 유형에 따른 라벨 반환
const getActionLabel = (action) => {
  if (!action) return 'OTHER';
  
  if (action.includes('등록') || action.includes('생성') || action.includes('추가')) {
    return 'CREATE';
  } else if (action.includes('삭제') || action.includes('제거')) {
    return 'DELETE';
  } else if (action.includes('수정') || action.includes('변경') || action.includes('업데이트')) {
    return 'UPDATE';
  } else if (action.includes('조회') || action.includes('검색') || action.includes('확인') || action.includes('전체 조회')) {
    return 'VIEW';
  } else {
    return 'ACTION';
  }
}

// 로그 다운로드
const downloadLogs = async () => {
  try {
    // 파일 다운로드 요청
    const response = await fetch('/api/admin/logs/download', {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
    
    // HTTP 상태 코드 확인
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`다운로드 오류 응답 (${response.status}):`, errorText);
      throw new Error(`서버 응답 오류 ${response.status}: ${errorText}`);
    }
    
    // 응답 헤더에서 콘텐츠 타입과 파일명 확인 (디버깅용)
    const contentType = response.headers.get('Content-Type');
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log('응답 콘텐츠 타입:', contentType);
    console.log('응답 Content-Disposition:', contentDisposition);
    
    const blob = await response.blob()
    
    // Blob의 타입을 Excel MIME 타입으로 설정
    const excelBlob = new Blob([blob], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(excelBlob)
    const a = document.createElement('a')
    a.href = url
    
    // 파일명 가져오기 또는 기본값 사용
    let filename = 'system-logs.xlsx';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    a.download = filename;
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } catch (error) {
    console.error('로그 다운로드 실패:', error)
    alert('시스템 로그 다운로드 중 오류가 발생했습니다: ' + error.message)
  }
}

// 날짜/시간 포맷
const formatDateTime = (date) => {
  if (!date) return '날짜 정보 없음';
  
  try {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('날짜 형식 변환 오류:', error);
    return String(date);
  }
}

// 짧은 날짜/시간 포맷 (요약용)
const formatShortDateTime = (date) => {
  if (!date) return '날짜 없음';
  
  try {
    return new Date(date).toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return String(date);
  }
}

// 로그 레벨 변경 시 데이터 다시 로드
watch(logLevel, () => {
  currentPage.value = 1
  fetchLogs(1)
})

// 버스 관련 로그 필터링
const findBusLogs = () => {
  console.log('버스 관련 로그 필터링 시작');
  
  // 버스 관련 검색어 설정
  searchQuery.value = '버스';
  
  // 로그 레벨을 버스로 설정
  logLevel.value = 'bus';
  
  // 현재 보여지는 로그에서 버스 관련 로그 필터링
  const busLogs = logs.value.filter(log => 
    (log.action && log.action.toLowerCase().includes('버스')) || 
    (log.target && (log.target.toLowerCase().includes('bus') || log.target.toLowerCase().includes('버스')))
  );
  
  console.log(`${busLogs.length}개의 버스 관련 로그 발견:`, busLogs);
  
  if (busLogs.length > 0) {
    // 버스 로그가 발견되면 자동으로 화면에 표시 (computed 속성이 자동으로 필터링함)
    debugMode.value = true; // 디버그 모드 활성화
  } else {
    alert('버스 관련 로그를 찾을 수 없습니다. 다른 페이지를 확인해보세요.');
  }
}

// 특정 ID 로그 검색 (예: 1134)
const findSpecificLog = (id) => {
  console.log(`ID ${id} 로그 검색`);
  searchQuery.value = id.toString();
  // 자동으로 필터링될 것임
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchLogs(1).then(() => {
    // 사용 가능한 페이지 업데이트
    updateAvailablePages();
  });
})
</script> 