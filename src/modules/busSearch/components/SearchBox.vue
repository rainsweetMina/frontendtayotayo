<template>
  <div class="search-box">
    <form @submit.prevent="onSearch" class="d-flex flex-2">
      <input
          type="text"
          v-model="keyword"
          placeholder="버스 번호/정류장 검색"
          class="form-control"
          style="flex: 5;"
      />
      <button type="submit" class="btn btn-outline-primary" style="flex:1;">검색</button>
    </form>
  </div>
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
