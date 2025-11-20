<template>
  <div class="step-footer">
    <el-button v-if="step > 0" @click="$emit('prev')">Quay lại</el-button>
    <el-button type="primary" @click="$emit('next')">
      {{ step === 3 ? 'Hoàn tất' : 'Tiếp theo' }}
    </el-button>
  </div>
</template>

<script setup>
const props = defineProps({
  step: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.step-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}
</style>
