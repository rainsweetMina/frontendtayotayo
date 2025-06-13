<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Headless UI 컴포넌트 데모</h1>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Headless UI란?</h2>
      <p class="text-gray-700 mb-4">
        Headless UI는 Tailwind Labs에서 개발한 완전히 접근성이 보장된 UI 컴포넌트 라이브러리로, 
        스타일링이 되어 있지 않은 컴포넌트를 제공합니다. 이를 통해 개발자는 자유롭게 디자인을 
        커스터마이징할 수 있으며, 접근성과 관련된 복잡한 로직은 신경 쓰지 않아도 됩니다.
      </p>
      <p class="text-gray-700">
        이 데모 페이지에서는 Bootstrap에서 Headless UI로 전환할 때 사용할 수 있는 
        다양한 컴포넌트 예제를 보여줍니다.
      </p>
    </div>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="border-b border-gray-200 px-6 py-4">
        <h2 class="text-xl font-semibold">컴포넌트 예제</h2>
      </div>
      <div class="p-6">
        <HeadlessExample />
      </div>
    </div>
    
    <div class="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Bootstrap에서 Headless UI로 전환하기</h2>
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-medium text-gray-900">1. 패키지 설치</h3>
          <pre class="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
            <code>npm install @headlessui/vue</code>
          </pre>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900">2. Bootstrap 의존성 제거</h3>
          <pre class="bg-gray-100 p-3 rounded-md mt-2 overflow-x-auto">
            <code>// main.js에서 부트스트랩 import 제거
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import 'bootstrap'</code>
          </pre>
        </div>
        
        <div>
          <h3 class="text-lg font-medium text-gray-900">3. 컴포넌트 변환 방법</h3>
          <ul class="list-disc pl-5 mt-2 space-y-2 text-gray-700">
            <li>Bootstrap 컴포넌트를 Headless UI + Tailwind CSS 조합으로 변환</li>
            <li>Headless UI 컴포넌트에 Tailwind 클래스로 스타일 적용</li>
            <li>접근성 및 키보드 네비게이션은 Headless UI에서 자동 처리</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeadlessExample from '@/components/HeadlessExample.vue'
</script> 