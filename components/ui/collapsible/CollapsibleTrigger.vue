<script setup lang="ts">
import { type HTMLAttributes, inject } from 'vue'
import { CollapsibleTrigger, type CollapsibleTriggerProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps< /* @vue-ignore */ CollapsibleTriggerProps & { class?: HTMLAttributes['class'] }>()

const context = inject<any>('collapsibleRoot')
</script>

<template>
  <CollapsibleTrigger
    v-bind="props"
    :class="cn('w-full', props.class)"
    :aria-expanded="context.isOpen"
  >
    <slot />
  </CollapsibleTrigger>
</template> 