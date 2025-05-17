<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface CardTitleProps extends /* @vue-ignore */ PrimitiveProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardTitleProps>()
</script>

<template>
  <Primitive
    :as-child="props.asChild"
    :class="cn('text-2xl font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </Primitive>
</template> 