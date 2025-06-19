<template>
  <div class="headless-examples p-6 space-y-8">
    <h2 class="text-2xl font-bold text-gray-800">Headless UI 컴포넌트 예제</h2>
    
    <!-- 버튼 예제 -->
    <div class="example-section">
      <h3 class="text-lg font-semibold mb-3">버튼</h3>
      <div class="flex space-x-4">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          기본 버튼
        </button>
        <button 
          class="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          아웃라인 버튼
        </button>
      </div>
    </div>
    
    <!-- 드롭다운 메뉴 예제 -->
    <div class="example-section">
      <h3 class="text-lg font-semibold mb-3">드롭다운 메뉴</h3>
      <Menu as="div" class="relative inline-block text-left">
        <MenuButton 
          class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          메뉴 열기
          <ChevronDownIcon class="w-5 h-5 ml-2 -mr-1 inline-block" aria-hidden="true" />
        </MenuButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems 
            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                  ]"
                >
                  메뉴 항목 1
                </button>
              </MenuItem>
              <MenuItem v-slot="{ active }">
                <button
                  :class="[
                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                    'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                  ]"
                >
                  메뉴 항목 2
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>
    
    <!-- 모달 다이얼로그 예제 -->
    <div class="example-section">
      <h3 class="text-lg font-semibold mb-3">모달 다이얼로그</h3>
      <button
        @click="isOpen = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        모달 열기
      </button>
      
      <Transition appear>
        <Dialog 
          as="div" 
          class="relative z-10" 
          :open="isOpen" 
          @close="isOpen = false"
        >
          <TransitionChild
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    모달 제목
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Headless UI를 사용한 모달 다이얼로그 예제입니다. 이 컴포넌트는 접근성 기능을 내장하고 있으며, 쉽게 스타일을 커스터마이징할 수 있습니다.
                    </p>
                  </div>

                  <div class="mt-4">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="isOpen = false"
                    >
                      확인
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
    
    <!-- 탭 예제 -->
    <div class="example-section">
      <h3 class="text-lg font-semibold mb-3">탭</h3>
      <TabGroup>
        <TabList class="flex space-x-1 rounded-xl bg-blue-50 p-1">
          <Tab v-slot="{ selected }" as="template">
            <button
              :class="[
                'w-full rounded-lg py-2 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
              ]"
            >
              탭 1
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button
              :class="[
                'w-full rounded-lg py-2 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
              ]"
            >
              탭 2
            </button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button
              :class="[
                'w-full rounded-lg py-2 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-500 hover:bg-white/[0.12] hover:text-blue-700'
              ]"
            >
              탭 3
            </button>
          </Tab>
        </TabList>
        <TabPanels class="mt-2">
          <TabPanel class="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <h3 class="text-md font-medium">첫 번째 탭 내용</h3>
            <p class="text-sm text-gray-500 mt-1">
              여기에 첫 번째 탭의 내용이 표시됩니다.
            </p>
          </TabPanel>
          <TabPanel class="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <h3 class="text-md font-medium">두 번째 탭 내용</h3>
            <p class="text-sm text-gray-500 mt-1">
              여기에 두 번째 탭의 내용이 표시됩니다.
            </p>
          </TabPanel>
          <TabPanel class="rounded-xl bg-white p-3 ring-1 ring-gray-200">
            <h3 class="text-md font-medium">세 번째 탭 내용</h3>
            <p class="text-sm text-gray-500 mt-1">
              여기에 세 번째 탭의 내용이 표시됩니다.
            </p>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuItems,
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@headlessui/vue'

// SVG 아이콘 (인라인으로 정의)
const ChevronDownIcon = {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    )
  }
}

// 모달 상태
const isOpen = ref(false)
</script> 