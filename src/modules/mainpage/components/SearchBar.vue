<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input 
        type="text" 
        class="search-input" 
        :placeholder="placeholder" 
        v-model="searchText"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">
        <span class="search-icon">🔍</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import { useSearchStore } from '@/stores/searchStore';

const props = defineProps({
  placeholder: {
    type: String,
    default: '검색어를 입력하세요'
  }
});

const emit = defineEmits(['search']);
const searchText = ref('');
const searchStore = useSearchStore();

// 컴포넌트 마운트 시 로컬 스토리지에서 검색 히스토리 로드
onMounted(() => {
  searchStore.loadRecentSearchesFromCache();
});

const handleSearch = () => {
  if (searchText.value.trim()) {
    // 검색 이벤트 발생
    emit('search', { 
      keyword: searchText.value
    });
    
    // 검색어를 searchStore에 추가
    searchStore.addToRecentSearches(searchText.value);
  }
};
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  position: relative;
}

.search-input-wrapper {
  display: flex;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: none;
  outline: none;
  font-size: 1rem;
  color: #333;
  background-color: white;
  transition: all 0.3s;
  height: 100%;
}

.search-input::placeholder {
  color: #888;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e73c9;
  color: white;
  border: none;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: #1a5ea0;
}

.search-icon {
  font-size: 1.2rem;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-input {
    padding: 12px 15px;
  }
  
  .search-button {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .search-input {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  
  .search-button {
    padding: 0 12px;
  }
  
  .search-icon {
    font-size: 1rem;
  }
}
</style> 