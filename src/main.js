import './assets/main.css'
import './main.js'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'leaflet/dist/leaflet.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import EmptyLayout from "@/layouts/components/EmptyLayout.vue";
import DashboardLayout from "@/layouts/components/DashboardLayout.vue";

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.component("default-layout", DashboardLayout);
app.component("empty-layout", EmptyLayout);
app.mount('#app')
