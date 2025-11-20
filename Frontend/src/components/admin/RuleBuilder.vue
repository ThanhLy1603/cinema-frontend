<template>
  <div class="p-4 border rounded">
    <p>Rule Builder MOCK</p>
  </div>
</template>

<script setup>
defineProps({
  newRule: Object,
  rules: Array,
  ruleTypes: Array,
  canAdd: Boolean
});
</script>
