<template>
   <div class="lightbox-bg" @click="close">
      <div class="lightbox" @click.stop>

         <!-- Nút đóng -->
         <button class="close-btn" @click="close">×</button>

         <div class="content-wrapper">

            <!-- Cột trái -->
            <div class="left-col">
               <div class="img-box">
                  <img :src="IMG_URL + promotion.poster" class="poster" />
               </div>
            </div>

            <!-- Cột phải -->
            <div class="right-col">
               <h1 class="title">{{ promotion.name }}</h1>

               <div class="meta">
                  <span class="date">{{ promotion.startDate }}</span>
                  <span class="arrow">→</span>
                  <span class="date">{{ promotion.endDate }}</span>
               </div>

               <div class="desc" v-html="promotion.description"></div>

               <!-- PRODUCTS -->
               <h3 class="label">Sản phẩm áp dụng:</h3>
               <ul class="list">
                  <li v-for="it in promotion.items" :key="it.id">
                     <span class="dot"></span>
                     {{ findProduct(it.productId) }}
                     <span v-if="it.note"> — {{ it.note }}</span>
                  </li>
               </ul>

               <!-- RULES -->
               <h3 class="label">Điều kiện áp dụng:</h3>
               <ul class="list">
                  <li v-for="rule in promotion.rules" :key="rule.id">
                     <span class="dot"></span>
                     <strong>{{ getRuleLabel(rule.ruleType) }}:</strong>
                     {{ formatRule(rule) }}
                  </li>
               </ul>

            </div>

         </div>
      </div>
   </div>
</template>

<script setup>
const props = defineProps({
   promotion: Object,
   products: Array
});

const emit = defineEmits(["close"]);
const IMG_URL = import.meta.env.VITE_IMAGE_URL;

function close() {
   emit("close");
}

function findProduct(id) {
   return props.products?.find(x => x.id === id)?.name ?? "-";
}

function getRuleLabel(type) {
   switch (type) {
      case "PERCENT": return "Giảm theo %";
      case "AMOUNT": return "Giảm số tiền";
      case "BUY_X_GET_Y": return "Mua X tặng Y";
      default: return type;
   }
}

function formatRule(rule) {
   let data;

   try {
      data = JSON.parse(rule.ruleValue);
   } catch {
      return rule.ruleValue;
   }

   switch (rule.ruleType) {
      case "PERCENT":
         return `Giảm ${data.percent}%`;

      case "AMOUNT":
         return `Giảm ${data.amount}đ`;

      case "BUY_X_GET_Y":
         return `Mua ${data.buy} tặng ${data.get}`;

      case "FIXED_COMBO":
         return `Combo ${formatCombo(data.items)} chỉ ${data.price.toLocaleString()}đ`;

      default:
         return rule.ruleValue;
   }
}

function formatCombo(items) {
   if (!items?.length) return "";

   return items
      .map(i => i.name)
      .join(", ");
}

</script>

<style scoped>
.lightbox-bg {
   position: fixed;
   inset: 0;
   background: rgba(0,0,0,0.2);
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 99999;
}

.lightbox {
   background: white;
   width: 1100px;
   max-height: 90vh;
   border-radius: 10px;
   padding: 30px 40px;
   overflow-y: auto;
   position: relative;
}

.close-btn {
   position: absolute;
   top: 12px;
   right: 18px;
   background: none;
   border: none;
   font-size: 30px;
   cursor: pointer;
}

.content-wrapper {
   display: flex;
   gap: 35px;
}

.left-col {
   width: 35%;
   text-align: center;
}

.poster {
   width: 100%;
   border-radius: 12px;
   object-fit: cover;
}

.social-row {
   margin-top: 15px;
   display: flex;
   justify-content: center;
   gap: 10px;
}

.icon-btn {
   border: 1px solid #ddd;
   padding: 6px 10px;
   background: #fff;
   cursor: pointer;
}

.right-col {
   width: 65%;
}

.title {
   font-size: 26px;
   font-weight: 800;
   margin-bottom: 10px;
   text-transform: uppercase;
}

.meta {
   color: #666;
   margin-bottom: 15px;
   display: flex;
   align-items: center;
   gap: 6px;
}

.desc {
   line-height: 1.6;
   margin-bottom: 15px;
   text-align: left;
}

.label {
   font-size: 18px;
   font-weight: 700;
   margin-top: 15px;
}

.list {
   margin: 8px 0 15px 0;
   padding: 0;
   list-style: none;
}

.list li {
   display: flex;
   align-items: flex-start;
   gap: 8px;
   margin-bottom: 6px;
}

.dot {
   margin-top: 7px;
   width: 6px;
   height: 6px;
   background: #333;
   border-radius: 50%;
}
</style>
