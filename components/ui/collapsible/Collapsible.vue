<script setup lang="ts">
import { type HTMLAttributes, provide } from 'vue'
import { CollapsibleRoot, type CollapsibleRootEmits, type CollapsibleRootProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps< /* @vue-ignore */ CollapsibleRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits< /* @vue-ignore */ CollapsibleRootEmits>()

provide('collapsibleRoot', {
  isOpen: props.open || props.defaultOpen || false,
  // @ts-expect-error an accessor is a function
  onUpdateOpen: props['onUpdate:open'],
})
</script>

<template>
  <CollapsibleRoot
    v-bind="props"
    :class="cn('w-full', props.class)"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </CollapsibleRoot>
</template> 