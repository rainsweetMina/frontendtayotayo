<template>
  <li class="nav-item dropdown">
    <a class="layout-header" href="#" :id="id" data-bs-toggle="dropdown" @click.prevent>
      {{ title }}
    </a>
    <ul class="dropdown-menu" :aria-labelledby="id">
      <li v-for="item in items" :key="item.label">
        <router-link class="dropdown-item" :to="item.to">{{ item.label }}</router-link>
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'NavbarDropdown',
  props: {
    id: String,
    title: String,
    items: Array // [{ label: '버스 요금', to: '/fare' }, ...]
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/web-user";

.navbar .dropdown {
  position: relative;
}
.navbar .dropdown-menu {
  position: absolute !important; /* 드롭다운이 아래 공간을 밀지 않게 함 */
  z-index: 1050;                 /* 겹침 우선순위 확보 */
}
.layout-header:hover {
  color: #ddd;
}
</style>