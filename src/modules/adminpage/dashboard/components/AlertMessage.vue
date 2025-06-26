<template>
  <div
    class="inline-flex w-auto max-w-md overflow-hidden bg-white rounded-lg shadow-md mb-4"
    :class="{ 'animate-fade-in': show }"
  >
    <div
      class="flex items-center justify-center w-10"
      :class="typeClasses.bgColor"
    >
      <svg
        class="w-5 h-5 text-white fill-current"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path v-if="type === 'success'" d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
        <path v-else-if="type === 'info'" d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
        <path v-else-if="type === 'warning'" d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
        <path v-else-if="type === 'error'" d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
      </svg>
    </div>

    <div class="px-3 py-1 -mx-2">
      <div class="mx-2">
        <span class="font-semibold" :class="typeClasses.textColor">{{ title }}</span>
        <p class="text-sm text-gray-600">{{ message }}</p>
      </div>
    </div>

    <div v-if="dismissible" class="flex items-center px-1">
      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMessage',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  computed: {
    typeClasses() {
      const classes = {
        success: {
          bgColor: 'bg-green-500',
          textColor: 'text-green-500'
        },
        info: {
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-500'
        },
        warning: {
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-500'
        },
        error: {
          bgColor: 'bg-red-500',
          textColor: 'text-red-500'
        }
      };
      
      return classes[this.type] || classes.info;
    }
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 