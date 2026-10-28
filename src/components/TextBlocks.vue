<script setup>
import LinkedText from './LinkedText.vue'
import { textBlocks } from '../data/parse.js'

// One renderer for both sheet text and the built-in fallback text, so they look the same.
defineProps({
  text: { type: String, default: '' },
})
</script>

<template>
  <template v-for="(block, index) in textBlocks(text)" :key="index">
    <ul v-if="block.list">
      <li v-for="(item, i) in block.list" :key="i"><LinkedText :text="item" /></li>
    </ul>
    <p v-else><LinkedText :text="block.paragraph" /></p>
  </template>
</template>

<style scoped>
p,
ul {
  margin: 0 0 0.75em;
}

p:last-child,
ul:last-child {
  margin-bottom: 0;
}

ul {
  padding-left: 1.2em;
}

/* Sheet text can contain long links; they must never widen the card. */
p,
li {
  overflow-wrap: anywhere;
}
</style>
