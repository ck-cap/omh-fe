<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface CardHeaderProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardHeaderProps>()
</script>

<template>
  <div :class="cn('flex flex-col space-y-1.5 p-6', props.class)">
    <slot />
  </div>
</template> 