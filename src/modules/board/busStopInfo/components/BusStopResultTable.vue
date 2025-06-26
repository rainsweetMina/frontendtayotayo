<template>
  <div class="table-wrapper">
    <table v-if="stops?.length" class="bus-stop-result-table">
      <thead>
      <tr>
        <th>주소</th>
        <th>정류소명</th>
        <th>지도</th>
        <th>주소</th>
        <th>정류소명</th>
        <th>지도</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(left, index) in leftStops" :key="index">
        <!-- 왼쪽 -->
        <td>{{ left.district }} {{ left.neighborhood || '' }}</td>
        <td>{{ left.busStop?.bsNm || left.bsNm }}</td>
<!--        <td :title="left.busStop?.bsNm || left.bsNm">
          <a
              :href="`/bus/map?bsId=${left.busStop?.bsId || left.bsId}&bsNm=${encodeURIComponent(left.busStop?.bsNm || left.bsNm)}`"
              target="_blank"
          >
            <i class="fa fa-map-marker-alt"></i>
          </a>
        </td>-->
        <td :title="left.busStop?.bsNm || left.bsNm">
          <!-- ✅ Vue Router로 이동 -->
          <i
              class="fa fa-map-marker-alt clickable-icon"
              @click="goToMap(left.busStop?.bsNm || left.bsNm)"
          ></i>
        </td>

        <!-- 오른쪽 -->
        <template v-if="rightStops[index]">
          <td>{{ rightStops[index].district }} {{ rightStops[index].neighborhood || '' }}</td>
          <td>
            {{ rightStops[index].busStop?.bsNm || rightStops[index].bsNm }}
          </td>
<!--          <td :title="rightStops[index].busStop?.bsNm || rightStops[index].bsNm">
            <a
                :href="`/bus/map?bsId=${rightStops[index].busStop?.bsId || rightStops[index].bsId}&bsNm=${encodeURIComponent(rightStops[index].busStop?.bsNm || rightStops[index].bsNm)}`"
                target="_blank"
            >
              <i class="fa fa-map-marker-alt"></i>
            </a>
          </td>-->
          <td :title="rightStops[index].busStop?.bsNm || rightStops[index].bsNm">
            <!-- ✅ Vue Router로 이동 -->
            <i
                class="fa fa-map-marker-alt clickable-icon"
                @click="goToMap(rightStops[index].busStop?.bsNm || rightStops[index].bsNm)"
            ></i>
          </td>
        </template>
        <template v-else>
          <td></td>
          <td></td>
          <td></td>
        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  stops: {
    type: Array,
    required: true
  }
})

function goToMap(stopName) {
  if (!stopName) return
  const keyword = encodeURIComponent(stopName)
  const url = `/bus/map?keyword=${keyword}`
  window.open(url, '_blank')
}

const leftStops = computed(() => {
  const half = Math.ceil(props.stops.length / 2)
  return props.stops.slice(0, half)
})

const rightStops = computed(() => {
  const half = Math.ceil(props.stops.length / 2)
  return props.stops.slice(half)
})
</script>

<style scoped>
@import "@/modules/board/assets/busStopInfo.css";

.table-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.bus-stop-result-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

td, th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
  text-align: left;
}

th:nth-child(1),
th:nth-child(4) {
  width: 40%;
}

th:nth-child(2),
th:nth-child(5) {
 width: 60%;
}

th:nth-child(3),
th:nth-child(6) {
  width: 50px;
  text-align: center;
}

.bus-stop-result-table a:hover {
  color: #0a3f94;
}

.fa-map-marker-alt{
  color: #0062ff;
}

.bus-stop-result-table a:hover,
.clickable-icon:hover {
  cursor: pointer;
}
</style>
