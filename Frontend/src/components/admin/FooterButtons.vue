<template>
  <div style="display:flex;justify-content:space-between;margin-top:20px">
    <el-button v-if="step > 0" @click="$emit('prev')">Quay lại</el-button>
    <el-button type="primary" @click="$emit('next')">Tiếp tục</el-button>
  </div>
</template>

<script setup>
defineProps({ step: Number });
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 10px;
}
</style>
