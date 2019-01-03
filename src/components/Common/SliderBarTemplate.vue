<template
  slot="label"
  slot-scope="{ label, active }"
>
            <span
              :class="['custom-label', { active }]"
              v-if="label % 25 === 0"
            >
              {{ label }}
            </span>
</template>
