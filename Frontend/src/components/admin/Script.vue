<template>
   <div class="container-fluid">
      <div class="promotion-wizard">
         <!-- Steps -->
         <el-steps :active="step" finish-status="success" class="mb-6">
            <el-step title="Thông tin chương trình" />
            <el-step title="Chọn sản phẩm" />
            <el-step title="Luật khuyến mãi" />
            <el-step title="Hoàn tất" />
         </el-steps>

         <div class="wizard-card">
            <!-- STEP 1: Thông tin -->
            <div v-show="step === 0" class="space-y-6 animate-fade">
               <h2 class="text-2xl font-bold text-gray-800">Thông tin chương trình</h2>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                     <label class="form-label"
                        >Tên chương trình <span class="text-red-500">*</span></label
                     >
                     <el-input v-model="promotion.name" placeholder="VD: Black Friday 60%" clearable />
                  </div>
                  <div>
                     <label class="form-label">Poster (khuyến khích 600x400)</label>
                  <div class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer" @click="$refs.file.click()">
                     <input type="file" ref="file" @change="e=>promotion.posterFile=e.target.files[0]" class="hidden" accept="image/*">
                     <el-icon size="50">
                        <div class="flex justify-between mt-10 pt-6 border-t">
  <el-button @click="step > 0 ? step-- : emit('close')">Quay lại</el-button>
  <el-button type="success" :loading="loading" @click="step < 3 ? step++ : finishPromotion()">
    {{ step === 3 ? 'Hoàn tất' : 'Tiếp theo' }}
  </el-button>
</div>
                     </el-icon>
                     <p class="mt-2">Click để tải poster</p>
                  </div>
                  </div>
               </div>

               <div>
                  <label class="form-label">Mô tả</label>
                  <el-input
                     v-model="promotion.description"
                     type="textarea"
                     :rows="3"
                     placeholder="Mô tả ngắn gọn chương trình..."
                  />
               </div>

               <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                     <label class="form-label">Ngày bắt đầu</label>
                     <el-date-picker
                        v-model="promotion.startDate"
                        type="datetime"
                        placeholder="Chọn ngày giờ"
                        class="w-full"
                     />
                  </div>
                  <div>
                     <label class="form-label">Ngày kết thúc</label>
                     <el-date-picker
                        v-model="promotion.endDate"
                        type="datetime"
                        placeholder="Chọn ngày giờ"
                        class="w-full"
                     />
                  </div>
               </div>

<div class="flex justify-between mt-10 pt-6 border-t">
  <el-button @click="step > 0 ? step-- : emit('close')">Quay lại</el-button>
  <el-button type="success" :loading="loading" @click="step < 3 ? step++ : finishPromotion()">
    {{ step === 3 ? 'Hoàn tất' : 'Tiếp theo' }}
  </el-button>
</div>
            </div>

            <!-- STEP 2: Chọn sản phẩm -->
            <div v-show="step === 1" class="animate-fade">
               <h2 class="text-2xl font-bold text-gray-800 mb-5">Chọn sản phẩm áp dụng</h2>

               <div class="flex items-center gap-4 mb-5">
                  <el-input
                     v-model="searchQuery"
                     placeholder="Tìm kiếm sản phẩm..."
                     prefix-icon="Search"
                     clearable
                     class="max-w-md"
                  />
                  <div class="text-sm text-gray-600">
                     Đã chọn: <strong>{{ selectedProducts.length }}</strong> sản phẩm
                  </div>
               </div>

               <div
                  v-if="loadingProducts"
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
               >
                  <el-skeleton v-for="n in 8" :key="n" class="product-skeleton" animated>
                     <template #template>
                        <el-skeleton-item variant="image" class="w-full h-48 rounded-xl" />
                        <el-skeleton-item variant="text" class="mt-3 w-4/5" />
                     </template>
                  </el-skeleton>
               </div>

               <div v-else class="product-grid">
                  <div
                     v-for="p in paginatedProducts"
                     :key="p.id"
                     class="product-card"
                     :class="{ selected: selectedProducts.includes(p.id) }"
                     @click="toggleProduct(p.id)"
                  >
                     <div class="img-wrapper">
                        <img :src="IMG + p.poster" alt="" />
                        <div class="overlay">
                           <el-icon v-if="selectedProducts.includes(p.id)" size="28"
                              ><Check
                           /></el-icon>
                        </div>
                     </div>
                     <div class="p-3">
                        <h4 class="font-medium text-sm line-clamp-2">{{ p.name }}</h4>
                        <el-input
                           v-if="selectedProducts.includes(p.id)"
                           v-model="productNotes[p.id]"
                           size="small"
                           placeholder="Ghi chú..."
                           class="mt-2"
                        />
                     </div>
                  </div>
               </div>

               <el-pagination
                  v-if="totalPages > 1"
                  class="mt-6 justify-center"
                  v-model:current-page="currentPage"
                  :page-size="itemsPerPage"
                  :total="filteredProducts.length"
                  layout="prev, pager, next"
                  background
               />

<div class="flex justify-between mt-10 pt-6 border-t">
  <el-button @click="step > 0 ? step-- : emit('close')">Quay lại</el-button>
  <el-button type="success" :loading="loading" @click="step < 3 ? step++ : finishPromotion()">
    {{ step === 3 ? 'Hoàn tất' : 'Tiếp theo' }}
  </el-button>
</div>
            </div>

            <!-- STEP 3: Luật khuyến mãi -->
            <div v-show="step === 2" class="animate-fade space-y-6">
               <h2 class="text-2xl font-bold text-gray-800">Luật khuyến mãi</h2>

               <div class="rule-builder-card">
                  <h3 class="text-lg font-semibold mb-4">Thêm luật mới</h3>
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                     <div class="md:col-span-3">
                        <el-select
                           v-model="newRule.ruleType"
                           placeholder="Chọn loại luật"
                           class="w-full"
                        >
                           <el-option
                              v-for="rt in ruleTypes"
                              :key="rt.value"
                              :value="rt.value"
                              :label="rt.label"
                           />
                        </el-select>
                     </div>

                     <div class="md:col-span-7">
                        <!-- PERCENT / TOTAL_PERCENT -->
                        <div v-if="/PERCENT/.test(newRule.ruleType)" class="flex items-end gap-3">
                           <el-input-number
                              v-model="newRule.percent"
                              :min="1"
                              :max="99"
                              class="w-32"
                           />
                           <span class="text-lg">%</span>
                           <span class="text-gray-600">giảm giá</span>
                        </div>

                        <!-- BUY_X_GET_Y -->
                        <div v-if="newRule.ruleType === 'BUY_X_GET_Y'" class="flex items-center gap-4">
                           <span>Mua</span>
                           <el-input-number v-model="newRule.buy" :min="1" class="w-24" />
                           <span>→ Tặng</span>
                           <el-input-number v-model="newRule.get" :min="1" class="w-24" />
                        </div>

                        <!-- FIXED_COMBO -->
                        <div v-if="newRule.ruleType === 'FIXED_COMBO'">
                           <div class="combo-preview mb-3">
                              <el-tag
                                 v-for="item in newRule.items"
                                 :key="item.name"
                                 closable
                                 @close="removeComboItem(item)"
                                 class="mr-2"
                              >
                                 {{ item.name }}
                              </el-tag>
                              <el-tag v-if="newRule.items.length === 0" type="info"
                                 >Chưa chọn sản phẩm</el-tag
                              >
                           </div>
                           <el-input-number
                              v-model="newRule.price"
                              :min="1000"
                              placeholder="Giá combo"
                           />
                        </div>
                     </div>

                     <div class="md:col-span-2">
                        <el-button
                           type="success"
                           :disabled="!canAddRule"
                           @click="addNewRule"
                           class="w-full"
                        >
                           <el-icon><Plus /></el-icon> Thêm
                        </el-button>
                     </div>
                  </div>
               </div>

               <!-- Danh sách rule đã thêm -->
               <div v-if="rules.length" class="space-y-3">
                  <div v-for="r in rules" :key="r.id" class="rule-item">
                     <div class="flex-1">
                        <strong>{{ r.label }}</strong>
                        <span class="text-sm text-gray-600 ml-3">
                           <template v-if="r.label.includes('giảm')"
                              >{{ r.condition.percent }}%</template
                           >
                           <template v-else-if="r.label === 'Mua X tặng Y'"
                              >Mua {{ r.condition.buy }} tặng {{ r.condition.get }}</template
                           >
                           <template v-else
                              >Combo {{ r.condition.items?.length }} món →
                              {{ formatPrice(r.condition.price) }}</template
                           >
                        </span>
                     </div>
                     <div>
                        <el-button v-if="r.isNew" size="small" type="primary" @click="applyRule(r.id)"
                           >Áp dụng</el-button
                        >
                        <el-button size="small" type="danger" @click="removeRule(r)">Xóa</el-button>
                     </div>
                  </div>
               </div>

            <div class="flex justify-between mt-10 pt-6 border-t">
               <el-button @click="step > 0 ? step-- : emit('close')">Quay lại</el-button>
               <el-button type="success" :loading="loading" @click="step < 3 ? step++ : finishPromotion()">
                  {{ step === 3 ? 'Hoàn tất' : 'Tiếp theo' }}
               </el-button>
            </div>
            </div>

            <!-- STEP 4: Tóm tắt & Hoàn tất -->
            <div v-show="step === 3" class="animate-fade">
               <h2 class="text-2xl font-bold text-success mb-6 text-center">
                  Xác nhận chương trình khuyến mãi
               </h2>

               <div class="summary-grid">
                  <div class="summary-card">
                     <img v-if="posterPreview" :src="posterPreview" class="summary-poster" />
                     <div v-else class="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                     <div class="mt-4 text-center">
                        <h3 class="text-xl font-bold">{{ promotion.name || 'Chưa đặt tên' }}</h3>
                        <p class="text-sm text-gray-600 mt-1">
                           {{ promotion.description || 'Không có mô tả' }}
                        </p>
                     </div>
                  </div>

                  <div class="summary-info">
                     <div class="info-item">
                        <span>Thời gian</span>
                        <strong
                           >{{ formatDate(promotion.startDate) }} →
                           {{ formatDate(promotion.endDate) }}</strong
                        >
                     </div>
                     <div class="info-item">
                        <span>Sản phẩm áp dụng</span>
                        <el-tag type="success">{{ selectedProducts.length }} sản phẩm</el-tag>
                     </div>
                     <div class="info-item">
                        <span>Luật khuyến mãi</span>
                        <div class="flex flex-wrap gap-2 mt-2">
                           <el-tag v-for="r in rules" :key="r.id" type="warning">
                              {{ r.label }} {{ r.condition.percent ? r.condition.percent + '%' : '' }}
                           </el-tag>
                           <el-tag v-if="!rules.length" type="info">Chưa có luật</el-tag>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="text-center mt-8">
                  <el-button
                     type="primary"
                     size="large"
                     :loading="loading"
                     @click="finishPromotion"
                     class="px-12"
                  >
                     Hoàn tất tạo chương trình
                  </el-button>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script setup>
   import { ref, computed, watch, onMounted } from 'vue';
   import axios from 'axios';
   import { ElMessage, ElMessageBox } from 'element-plus';
   import { Check, Plus, Search } from '@element-plus/icons-vue';

   const props = defineProps({ promotionData: Object });
   const emit = defineEmits(['saved', 'close', 'reload']);

   const step = ref(0);
   const loading = ref(false);
   const loadingProducts = ref(true);

   const API_PROMO = `${import.meta.env.VITE_API_BASE_URL}/admin/promotions`;
   const API_PRODUCT = `${import.meta.env.VITE_API_BASE_URL}/admin/products`;
   const IMG = import.meta.env.VITE_IMAGE_URL;

   // Dữ liệu form
   const promotion = ref({
      id: null,
      name: '',
      description: '',
      startDate: null,
      endDate: null,
      posterFile: null,
   });
   const posterPreview = ref('');

   const products = ref([]);
   const selectedProducts = ref([]);
   const productNotes = ref({});
   const searchQuery = ref('');
   const currentPage = ref(1);
   const itemsPerPage = 12;

   const rules = ref([]);
   const newRule = ref({ ruleType: 'PERCENT', percent: 0, buy: 0, get: 0, items: [], price: 0 });

   const ruleTypes = [
      { value: 'PERCENT', label: 'Giảm % theo sản phẩm' },
      { value: 'TOTAL_PERCENT', label: 'Giảm % tổng bill' },
      { value: 'BUY_X_GET_Y', label: 'Mua X tặng Y' },
      { value: 'FIXED_COMBO', label: 'Combo giá cố định' },
   ];

   // ========== COMPUTED ==========
   const filteredProducts = computed(() => {
      const q = searchQuery.value.toLowerCase();
      return q ? products.value.filter((p) => p.name.toLowerCase().includes(q)) : products.value;
   });
   const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredProducts.value.slice(start, start + itemsPerPage);
   });
   const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

   const canAddRule = computed(() => {
      const r = newRule.value;
      if (['PERCENT', 'TOTAL_PERCENT'].includes(r.ruleType)) return r.percent > 0;
      if (r.ruleType === 'BUY_X_GET_Y') return r.buy > 0 && r.get > 0;
      if (r.ruleType === 'FIXED_COMBO') return r.items.length >= 2 && r.price > 0;
      return false;
   });

   // ========== HÀM RESET FORM (QUAN TRỌNG) ==========
   function resetForm() {
      promotion.value = {
         id: null,
         name: '',
         description: '',
         startDate: null,
         endDate: null,
         posterFile: null,
      };
      posterPreview.value = '';
      selectedProducts.value = [];
      productNotes.value = {};
      rules.value = [];
      newRule.value = { ruleType: 'PERCENT', percent: 0, buy: 0, get: 0, items: [], price: 0 };
      step.value = 0;
   }

   // ========== WATCH EDIT MODE ==========
   watch(
      () => props.promotionData,
      (data) => {
         if (!data) {
            resetForm();
            return;
         }

         // Load dữ liệu khi edit
         promotion.value = {
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            posterFile: null,
         };
         if (data.poster) posterPreview.value = IMG + data.poster;

         selectedProducts.value = data.items?.map((i) => i.productId) || [];
         productNotes.value = {};
         data.items?.forEach((i) => {
            productNotes.value[i.productId] = i.note || '';
         });

         rules.value = (data.rules || []).map((r) => {
            let condition = typeof r.ruleValue === 'string' ? JSON.parse(r.ruleValue) : r.ruleValue;
            if (r.ruleType === 'FIXED_COMBO' && condition.items) {
               condition.items = condition.items.map((name) => {
                  const p = products.value.find((x) => x.name === name);
                  return { name, poster: p?.poster || '' };
               });
            }
            const label = ruleTypes.find((rt) => rt.value === r.ruleType)?.label || r.ruleType;
            return { id: r.id, label, condition, isNew: false };
         });

         step.value = 0;
      },
      { immediate: true }
   );

   // ========== LIFECYCLE ==========
   onMounted(() => {
      axios.get(API_PRODUCT).then((r) => {
         products.value = r.data;
         loadingProducts.value = false;
      });
   });

   // ========== CÁC HÀM CHÍNH ==========
   const toast = (msg, type = 'success') => ElMessage({ message: msg, type });

   function savePromotion() {
      if (!promotion.value.name) return ElMessage.error('Nhập tên chương trình');
      loading.value = true;

      const fd = new FormData();
      fd.append('name', promotion.value.name);
      fd.append('description', promotion.value.description || '');
      fd.append('startDate', promotion.value.startDate?.toISOString().slice(0, 10) || '');
      fd.append('endDate', promotion.value.endDate?.toISOString().slice(0, 10) || '');
      if (promotion.value.posterFile) fd.append('posterFile', promotion.value.posterFile);

      const req = promotion.value.id
         ? axios.put(`${API_PROMO}/${promotion.value.id}`, fd)
         : axios.post(API_PROMO, fd).then((r) => {
              promotion.value.id = r.data.id;
           });

      req.then(() => {
         toast('Lưu thành công');
         step.value = 1;
      })
         .catch(() => toast('Lỗi hệ thống', 'error'))
         .finally(() => (loading.value = false));
   }

   function applyProducts() {
      loading.value = true;
      const payload = selectedProducts.value.map((id) => ({
         productId: id,
         note: productNotes.value[id] || '',
      }));

      axios
         .put(`${API_PROMO}/${promotion.value.id}/items`, payload)
         .then(() => {
            toast('Cập nhật sản phẩm thành công');
            step.value = 2;
         })
         .catch(() => toast('Lỗi cập nhật sản phẩm', 'error'))
         .finally(() => (loading.value = false));
   }

   function addNewRule() {
      if (!canAddRule.value) return;

      let condition = {};
      const type = newRule.value.ruleType;
      if (['PERCENT', 'TOTAL_PERCENT'].includes(type))
         condition = { percent: newRule.value.percent };
      else if (type === 'BUY_X_GET_Y')
         condition = { buy: newRule.value.buy, get: newRule.value.get };
      else if (type === 'FIXED_COMBO')
         condition = { items: newRule.value.items.map((i) => i.name), price: newRule.value.price };

      rules.value.push({
         id: Date.now(),
         label: ruleTypes.find((rt) => rt.value === type).label,
         condition,
         isNew: true,
      });

      newRule.value = { ruleType: 'PERCENT', percent: 0, buy: 0, get: 0, items: [], price: 0 };
      toast('Đã thêm luật');
   }

   function applyRule(id) {
      const rule = rules.value.find((r) => r.id === id);
      if (!rule) return;

      const payload = [
         {
            ruleType: ruleTypes.find((rt) => rt.label === rule.label)?.value,
            ruleValue: rule.condition,
         },
      ];

      axios
         .post(`${API_PROMO}/${promotion.value.id}/rules`, payload)
         .then(() => {
            rule.isNew = false;
            toast('Áp dụng luật thành công');
         })
         .catch(() => toast('Lỗi', 'error'));
   }

   function removeRule(rule) {
      if (rule.isNew) {
         rules.value = rules.value.filter((r) => r.id !== rule.id);
         return;
      }
      ElMessageBox.confirm('Xóa luật này?', 'Xác nhận', { type: 'warning' }).then(() => {
         axios.delete(`${API_PROMO}/rules/${rule.id}`).then(() => {
            rules.value = rules.value.filter((r) => r.id !== rule.id);
            toast('Đã xóa');
         });
      });
   }

   function toggleProduct(id) {
      selectedProducts.value.includes(id)
         ? (selectedProducts.value = selectedProducts.value.filter((x) => x !== id))
         : selectedProducts.value.push(id);
   }

   function removeComboItem(item) {
      newRule.value.items = newRule.value.items.filter((i) => i.name !== item.name);
   }

   function finishPromotion() {
      ElMessageBox.alert('Chương trình khuyến mãi đã được tạo thành công!', 'Hoàn tất', {
         type: 'success',
      }).then(() => {
         emit('saved');
         emit('reload');
         emit('close');
      });
   }

   // Format helper
   function formatDate(date) {
      return date ? new Date(date).toLocaleString('vi-VN') : '—';
   }
   function formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
   }
</script>

<style scoped>
   /* Đẹp như app bán hàng */
   .promotion-wizard {
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
   }
   .wizard-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
   }

   .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #1f2937;
   }

   /* Grid sản phẩm */
   .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
   }
   .product-card {
      border: 2px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
   }
   .product-card:hover {
      border-color: #2ecc71;
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(46, 204, 113, 0.15);
   }
   .product-card.selected {
      border-color: #2ecc71;
      background: #f0fdf4;
   }
   .img-wrapper {
      position: relative;
      height: 160px;
   }
   .img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }
   .overlay {
      position: absolute;
      inset: 0;
      background: rgba(46, 204, 113, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: 0.3s;
   }
   .product-card.selected .overlay {
      opacity: 1;
   }

   /* Summary */
   .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      align-items: start;
   }
   .summary-poster {
      width: 100%;
      height: 280px;
      object-fit: cover;
      border-radius: 16px;
   }
   .summary-info {
      background: #f9fafb;
      padding: 24px;
      border-radius: 16px;
   }
   .info-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
   }

   /* Footer */
   .footer-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
   }

   /* Animation */
   .animate-fade {
      animation: fadeIn 0.4s ease;
   }
   @keyframes fadeIn {
      from {
         opacity: 0;
         transform: translateY(10px);
      }
      to {
         opacity: 1;
         transform: none;
      }
   }
</style>
