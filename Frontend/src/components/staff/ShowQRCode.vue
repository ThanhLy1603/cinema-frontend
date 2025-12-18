<template>
   <div class="container-fluid">
      <img v-if="qrImage" :src="qrImage" width="220" alt="">
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import QRCode from 'qrcode';

   const qrImage = ref(null);

   const qrString = 'ZTdjYmI1MzctZTMzZC00NTZhLTk4MjEtNWE4MjBmOTNkYThifE1PVklFX1FSX1NFQ1JFVA==';

   onMounted(async() => {
      qrImage.value = await QRCode.toDataURL(qrString, {
         width: 220,
         margin: 2
      });
   });
</script>

<style scoped>

</style>