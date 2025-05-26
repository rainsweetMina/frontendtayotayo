<template>
  <form @submit.prevent="onSearch">
    <input type="text" v-model="keyword" placeholder="버스 번호/정류장 검색" />
    <button type="submit">검색</button>
  </form>
</template>

<script>
export default {
  emits: ['search'],
  data() {
    return { keyword: '' }
  },
  methods: {
    onSearch() {
      this.$emit('search', this.keyword)
    }
  }
}
</script>
