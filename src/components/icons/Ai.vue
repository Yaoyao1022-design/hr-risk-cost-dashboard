<template>
  <!-- eslint-disable vue/no-v-html -->
  <span class="lui-icon lui-icon-Ai" v-html="svg" aria-hidden="true" />
</template>

<script>
import svg from '@/assets/icons/menu/ai.svg?raw'

export default {
  name: 'Ai',
  data() {
    return { svg }
  }
}
</script>

<style>
.lui-icon-Ai {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
.lui-icon-Ai >>> svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
