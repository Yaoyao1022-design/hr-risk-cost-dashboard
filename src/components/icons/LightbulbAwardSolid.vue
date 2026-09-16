<template>
  <!-- eslint-disable vue/no-v-html -->
  <span class="lui-icon lui-icon-LightbulbAwardSolid" v-html="svg" aria-hidden="true" />
</template>

<script>
import svg from '@/assets/icons/menu/collect-award.svg?raw'

export default {
  name: 'LightbulbAwardSolid',
  data() {
    return { svg }
  }
}
</script>

<style>
.lui-icon-LightbulbAwardSolid {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
.lui-icon-LightbulbAwardSolid >>> svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
