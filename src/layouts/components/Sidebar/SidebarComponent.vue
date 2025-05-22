<template>
  <aside class="sidebar-content">
    <div class="search-box">
      <form @submit.prevent="searchBus" class="d-flex flex-column gap-2">
        <input
            type="text"
            v-model="keyword"
            placeholder="버스 번호/정류장 검색"
            class="form-control"
        />
        <button type="submit" class="btn btn-outline-light">검색</button>
      </form>
    </div>

    <div class="position-sticky pt-3 sidebar-sticky">
      <div id="busStopList">
        <div v-for="stop in stops" :key="stop.id">{{ stop.name }}</div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SidebarComponent',
  data() {
    return {
      keyword: '',
      stops: []
    }
  },
  methods: {
    searchBus() {
      this.stops = [
        { id: 1, name: '중앙로 정류장' },
        { id: 2, name: '시청앞 정류장' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar-content {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background-color: #212529;
  color: white;
}

.sidebar-sticky {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  scrollbar-width: none;
}
.sidebar-sticky::-webkit-scrollbar {
  display: none;
}

#busStopList div {
  padding: 10px;
  border: 1px solid #444;
  margin-bottom: 5px;
  background-color: #343a40;
}

input,
button {
  width: 100%;
  max-width: 100%;
}
</style>