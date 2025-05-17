<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface CardDescriptionProps extends /* @vue-ignore */ PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardDescriptionProps>()
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </Primitive>
</template> 