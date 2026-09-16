<template>
  <!-- eslint-disable vue/no-v-html -->
  <span class="lui-icon lui-icon-AiSolid" v-html="svg" aria-hidden="true" />
</template>

<script>
import svg from '@/assets/icons/menu/ai-solid.svg?raw'

export default {
  name: 'AiSolid',
  data() {
    return { svg }
  }
}
</script>

<style>
.lui-icon-AiSolid {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
.lui-icon-AiSolid >>> svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
