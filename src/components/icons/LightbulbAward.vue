<template>
  <!-- eslint-disable vue/no-v-html -->
  <span class="lui-icon lui-icon-LightbulbAward" v-html="svg" aria-hidden="true" />
</template>

<script>
import svg from '@/assets/icons/menu/lightbulb-award.svg?raw'

export default {
  name: 'LightbulbAward',
  data() {
    return { svg }
  }
}
</script>

<style>
.lui-icon-LightbulbAward {
  display: inline-flex;
  width: 1em;
  height: 1em;
}
.lui-icon-LightbulbAward >>> svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
