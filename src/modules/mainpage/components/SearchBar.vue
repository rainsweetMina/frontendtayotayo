<template>
  <div class="search-bar">
    <div class="search-icon-left">
      <span>🔍</span>
    </div>
    <input 
      type="text" 
      class="search-input" 
      :placeholder="placeholder" 
      v-model="searchText"
      @keyup.enter="handleSearch"
    />
    <button class="search-button" @click="handleSearch">
      검색
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const props = defineProps({
  placeholder: {
    type: String,
    default: '검색어를 입력하세요'
  }
});

const emit = defineEmits(['search']);
const searchText = ref('');

const handleSearch = () => {
  if (searchText.value.trim()) {
    emit('search', { 
      keyword: searchText.value
    });
  }
};
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  border: 3px solid #2a7dc0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  transition: all 0.3s ease;
  position: relative;
  background-color: white;
  height: 70px;
}

.search-bar:focus-within {
  box-shadow: 0 12px 30px rgba(42, 125, 192, 0.2);
  border-color: #1e6cb1;
}

.search-icon-left {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 1.6rem;
  color: #2a7dc0;
  background-color: rgba(42, 125, 192, 0.08);
  height: 100%;
}

.search-input {
  flex: 1;
  padding: 20px 20px;
  border: none;
  outline: none;
  font-size: 1.2rem;
  color: #333;
  background-color: white;
  transition: all 0.3s;
  height: 100%;
}

.search-input::placeholder {
  color: #8b8b8b;
  transition: color 0.3s;
}

.search-input:focus::placeholder {
  color: #aaa;
}

.search-button {
  background-color: #2a7dc0;
  color: white;
  border: none;
  padding: 0 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  height: 100%;
  display: flex;
  align-items: center;
  background-image: linear-gradient(to right, #2a7dc0, #3a8dd0);
}

.search-button:hover {
  background-color: #1e6cb1;
  background-image: linear-gradient(to right, #1e6cb1, #2a7dc0);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-bar {
    flex-wrap: wrap;
  }
  
  .search-input {
    order: 2;
    width: 100%;
    flex: 1 0 60%;
    padding: 15px;
  }
  
  .search-icon-left {
    order: 1;
    padding: 15px 10px;
  }
  
  .search-button {
    order: 3;
    width: auto;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .search-bar {
    border-radius: 8px;
  }
  
  .search-input {
    font-size: 1rem;
    padding: 12px 10px;
  }
  
  .search-button {
    font-size: 0.9rem;
  }
}
</style> 