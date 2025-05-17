import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'apexcharts'; // Import the core library
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts);
  // Make ApexCharts available globally if needed, e.g., for calling methods directly
  nuxtApp.vueApp.config.globalProperties.$apexcharts = ApexCharts;
}); 