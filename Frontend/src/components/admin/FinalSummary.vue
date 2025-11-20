<template>
  <div class="p-4 border rounded">
    <pre>{{ promotion }}</pre>
  </div>
</template>

<script setup>
defineProps({
  promotion: Object,
  rules: Array,
  poster: String,
  selected: Number
});
</script>
