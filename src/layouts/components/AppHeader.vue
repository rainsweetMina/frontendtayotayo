<template>
  <header
    :class="[
      'transition-transform duration-300 ease-in-out',
      'flex items-center justify-between px-6 py-2 bg-white border-b-4 border-indigo-600',
      isHeaderVisible ? 'fixed top-0 left-0 right-0 z-50' : 'fixed top-0 left-0 right-0 z-50 -translate-y-full'
    ]"
  >
    <div class="flex items-center">
      <button
        @click="isOpen = true"
        class="text-gray-500 focus:outline-none lg:hidden"
      >
        <svg
          class="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6H20M4 12H20M4 18H11"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="relative mx-4 lg:mx-0">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <input
          class="
            w-32
            pl-10
            pr-4
            py-2
            text-indigo-600
            border-gray-200
            rounded-md
            sm:w-64
            focus:border-indigo-600
            focus:ring
            focus:ring-opacity-40
            focus:ring-indigo-500
          "
          type="text"
          placeholder="Search"
        />
      </div>
    </div>

    <div class="flex items-center">
      <div class="flex items-center">
        <div class="relative">
          <button
            @click="notificationOpen = !notificationOpen"
            class="flex mx-4 text-gray-600 focus:outline-none"
          >
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div
            v-show="notificationOpen"
            @click="notificationOpen = false"
            class="fixed inset-0 h-full w-full z-10"
          ></div>

          <div
            v-show="notificationOpen"
            class="
              absolute
              right-0
              mt-2
              w-80
              bg-white
              rounded-lg
              shadow-xl
              overflow-hidden
              z-10
            "
            style="width: 20rem"
          >
            <a
              href="#"
              class="
                flex
                items-center
                px-4
                py-3
                text-gray-600
                hover:text-white hover:bg-indigo-600
                -mx-2
              "
            >
              <img
                class="h-8 w-8 rounded-full object-cover mx-1"
                src="https://images.unsplash.com/photo-1552774021-9ebbb764f03e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
                alt="avatar"
              />
              <p class="text-sm mx-2">
                <span class="font-bold" href="#">Evan Josh</span> replied on the
                <span class="font-bold text-indigo-400" href="#"
                  >Upload Image</span
                >
                artical . 2m
              </p>
            </a>
            <a
              href="#"
              class="
                flex
                items-center
                px-4
                py-3
                text-gray-600
                hover:text-white hover:bg-indigo-600
                -mx-2
              "
            >
              <img
                class="h-8 w-8 rounded-full object-cover mx-1"
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                alt="avatar"
              />
              <p class="text-sm mx-2">
                <span class="font-bold" href="#">Slick Net</span> start
                following you . 45m
              </p>
            </a>
            <a
              href="#"
              class="
                flex
                items-center
                px-4
                py-3
                text-gray-600
                hover:text-white hover:bg-indigo-600
                -mx-2
              "
            >
              <img
                class="h-8 w-8 rounded-full object-cover mx-1"
                src="https://images.unsplash.com/photo-1450297350677-623de575f31c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                alt="avatar"
              />
              <p class="text-sm mx-2">
                <span class="font-bold" href="#">Jane Doe</span> Like Your reply
                on
                <span class="font-bold text-indigo-400" href="#"
                  >Test with TDD</span
                >
                artical . 1h
              </p>
            </a>
            <a
              href="#"
              class="
                flex
                items-center
                px-4
                py-3
                text-gray-600
                hover:text-white hover:bg-indigo-600
                -mx-2
              "
            >
              <img
                class="h-8 w-8 rounded-full object-cover mx-1"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=398&q=80"
                alt="avatar"
              />
              <p class="text-sm mx-2">
                <span class="font-bold" href="#">Abigail Bennett</span>
                start following you . 3h
              </p>
            </a>
          </div>
        </div>
      </div>
      <div class="relative">
        <button
          @click="dropdownOpen = !dropdownOpen"
          class="
            relative
            z-10
            block
            w-8
            h-8
            overflow-hidden
            rounded-full
            shadow
            focus:outline-none
          "
        >
          <img
            class="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
            alt="Your avatar"
          />
        </button>

        <div
          v-show="dropdownOpen"
          @click="dropdownOpen = false"
          class="fixed inset-0 z-10 w-full h-full"
        ></div>

        <transition
          enter-active-class="transition duration-150 ease-out transform"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in transform"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-show="dropdownOpen"
            class="
              absolute
              right-0
              z-20
              w-48
              py-1
              mt-2
              bg-white
              rounded-lg
              shadow-xl
            "
          >
            <a
              href="#"
              class="
                px-4
                py-2
                flex
                rounded-md
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile</a
            >
            <a
              href="#"
              class="
                flex
                rounded-md
                px-4
                py-2
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings</a
            >
            <router-link
              to="/"
              class="
                flex
                px-4
                py-2
                rounded-md
                text-sm text-gray-700
                hover:bg-indigo-600 hover:text-white
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out</router-link
            >
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dropdownOpen = ref(false)
const notificationOpen = ref(false)
const isOpen = ref(false)
const isHeaderVisible = ref(true)

// 스크롤 관련 변수들
let lastScrollY = 0
let ticking = false

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY
      
      // 스크롤 방향에 따라 헤더 표시/숨김
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤하고 100px 이상 스크롤했을 때 헤더 숨김
        isHeaderVisible.value = false
      } else if (currentScrollY < lastScrollY) {
        // 위로 스크롤할 때 헤더 표시
        isHeaderVisible.value = true
      }
      
      lastScrollY = currentScrollY
      ticking = false
    })
    
    ticking = true
  }
}

// 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 컴포넌트 언마운트 시 스크롤 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
