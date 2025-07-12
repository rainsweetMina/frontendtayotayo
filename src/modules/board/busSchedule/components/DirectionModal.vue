<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ routeNo }}번 노선 방향 선택</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </div>
      
      <div class="modal-body">
        <p class="direction-description">운행 방향을 선택해주세요:</p>
        
        <div class="direction-options">
          <div 
            v-for="dir in directions" 
            :key="dir.value"
            class="direction-option"
            :class="{ 'selected': selectedDirection === dir.value }"
            @click="selectDirection(dir.value)"
          >
            <div class="direction-icon">
              <span v-if="dir.value === '0'">→</span>
              <span v-else-if="dir.value === '1'">←</span>
              <span v-else>↔</span>
            </div>
            <div class="direction-info">
              <div class="direction-name">{{ dir.label }}</div>
              <div class="direction-detail">{{ dir.description }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-btn" @click="closeModal">취소</button>
        <button 
          class="confirm-btn" 
          @click="confirmSelection"
          :disabled="!selectedDirection"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  routeNo: {
    type: String,
    default: ''
  },
  directions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'confirm'])

const selectedDirection = ref('')

// 모달이 열릴 때마다 선택 초기화
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    selectedDirection.value = ''
  }
})

function selectDirection(direction) {
  selectedDirection.value = direction
}

function closeModal() {
  emit('close')
}

function confirmSelection() {
  if (selectedDirection.value) {
    emit('confirm', selectedDirection.value)
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #e0e0e0;
}

.modal-body {
  padding: 24px;
}

.direction-description {
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.direction-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.direction-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fafafa;
}

.direction-option:hover {
  border-color: #1976d2;
  background-color: #f0f8ff;
}

.direction-option.selected {
  border-color: #1976d2;
  background-color: #e3f2fd;
}

.direction-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1976d2;
  color: white;
  border-radius: 50%;
  margin-right: 16px;
  font-size: 18px;
  font-weight: bold;
}

.direction-info {
  flex: 1;
}

.direction-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.direction-detail {
  font-size: 14px;
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  background-color: #f8f9fa;
}

.cancel-btn,
.confirm-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.confirm-btn {
  background-color: #1976d2;
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  background-color: #1565c0;
}

.confirm-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .direction-option {
    padding: 12px;
  }
  
  .direction-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
    margin-right: 12px;
  }
}
</style> 