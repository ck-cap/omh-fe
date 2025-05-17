<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { CollapsibleContent, type CollapsibleContentProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps< /* @vue-ignore */ CollapsibleContentProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <CollapsibleContent
    v-bind="props"
    :class="cn(
      'overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down',
      props.class,
    )"
  >
    <slot />
  </CollapsibleContent>
</template> 