<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        // Custom variants for status colors - you can define HSL values in tailwind.css if needed
        // For now, we'll rely on direct class bindings in the dashboard for unique colors if these are not sufficient
        yellow: 'border-transparent bg-yellow-400 text-yellow-800 hover:bg-yellow-500',
        blue: 'border-transparent bg-blue-400 text-blue-800 hover:bg-blue-500',
        green: 'border-transparent bg-green-400 text-green-800 hover:bg-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps extends /* @vue-ignore */ VariantProps<typeof badgeVariants> {
  class?: HTMLAttributes['class']
}

const props = defineProps<BadgeProps>()
</script>

<template>
  <div :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </div>
</template> 