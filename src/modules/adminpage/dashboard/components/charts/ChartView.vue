<template>
  <div>
    <!-- Breadcrumb -->
    <Breadcrumb breadcrumb="charts" />

    <div class="mt-4">
      <h4 class="text-gray-600">Charts</h4>

      <div class="mt-6">
        <div
          class="
            my-6
            overflow-hidden
            bg-white
            rounded-md
            shadow
            grid grid-cols-2
            gap-3
          "
        >
          <LineChart />
          <DonutChart />
          <BarChart />
          <AreaChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from "../../../../../partials/AppBreadcrumb.vue";
import DonutChart from "@/modules/adminpage/dashboard/components/charts/DonutChart.vue";
import LineChart from "@/modules/adminpage/dashboard/components/charts/LineChart.vue";
import BarChart from "@/modules/adminpage/dashboard/components/charts/BarChart.vue";
import AreaChart from "@/modules/adminpage/dashboard/components/charts/AreaChart.vue";
</script>
