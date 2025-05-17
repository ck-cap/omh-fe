<template>
  <div>
    <apexchart
      v-if="chartOptions && chartSeries.length > 0"
      type="radar"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    ></apexchart>
    <div v-else class="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 min-h-[200px] flex items-center justify-center">
      <p class="text-slate-500 italic">Attribute data is not available for this candidate.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import type { ApexOptions } from 'apexcharts';

interface CandidateAttributes {
  education: number;
  experience: number;
  character: number;
  cultureFit: number;
}

const props = defineProps<{
  attributes: CandidateAttributes | null | undefined;
  candidateName: string | null | undefined;
}>();

const chartOptions = ref<ApexOptions | null>(null);
const chartSeries = ref<ApexAxisChartSeries | ApexNonAxisChartSeries>([]);

const initializeChart = () => {
  if (props.attributes) {
    chartOptions.value = {
      chart: {
        type: 'radar',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        }
      },
      title: {
        text: props.candidateName ? `${props.candidateName}` : 'Candidate Attributes',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#334155' // slate-700
        }
      },
      xaxis: {
        categories: ['Education', 'Experience', 'Character', 'Culture Fit'],
        labels: {
          style: {
            colors: ['#475569', '#475569', '#475569', '#475569'], // slate-600
            fontSize: '13px',
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (val) => val.toFixed(0),
          style: {
            colors: '#64748b' // slate-500
          }
        },
      },
      stroke: {
        width: 2,
        colors: ['#6366F1'], // indigo-500
      },
      fill: {
        opacity: 0.3,
        colors: ['#818CF8'], // indigo-400
      },
      markers: {
        size: 4,
        colors: ['#ffffff'],
        strokeColors: '#6366F1', // indigo-500
        strokeWidth: 2,
        hover: {
          size: 6
        }
      },
      tooltip: {
        y: {
          formatter: (val) => `${val}`,
        },
      },
      dataLabels: {
        enabled: true,
        background: {
          enabled: true,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#6366F1',
          opacity: 0.9,
          dropShadow: {
            enabled: false
          }
        },
        formatter: (val: number) => val.toFixed(0),
        style: {
          fontSize: '12px',
          colors: ['#334155']
        }
      },
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#e2e8f0', // slate-200
            connectorColors: '#cbd5e1', // slate-300
            fill: {
              colors: undefined // No fill for polygons background
            }
          }
        }
      }
    };
    chartSeries.value = [{
      name: props.candidateName || 'Attributes',
      data: [
        props.attributes.education,
        props.attributes.experience,
        props.attributes.character,
        props.attributes.cultureFit,
      ],
    }];
  } else {
    chartOptions.value = null;
    chartSeries.value = [];
  }
};

watch(() => [props.attributes, props.candidateName], initializeChart, { deep: true });
onMounted(initializeChart);

</script>

<style scoped>
/* Add any specific styles for the chart component if needed */
</style> 