<template>
   <div class="promo-wrapper">
      <el-steps :active="step" finish-status="success" class="promo-steps">
         <el-step title="Tạo chương trình"></el-step>
         <el-step title="Chọn sản phẩm"></el-step>
         <el-step title="Luật áp dụng"></el-step>
      </el-steps>

      <!-- CARD KHUNG -->
      <div class="promo-card">

         <!-- STEP 1 -->
         <div v-show="step === 0" class="step-container fade-in">

            <div class="form-group">
               <label class="form-label">Tên chương trình *</label>
               <input v-model="promotion.name" class="form-control ui-input" />
            </div>

            <div class="form-group">
               <label class="form-label">Mô tả *</label>
               <textarea
                  v-model="promotion.description"
                  class="form-control ui-textarea"
                  rows="3"
               ></textarea>
            </div>

            <div class="row">
               <div class="col-md-6 form-group">
                  <label class="form-label">Bắt đầu</label>
                  <input type="datetime-local" v-model="promotion.startDate" class="form-control ui-input" />
               </div>

               <div class="col-md-6 form-group">
                  <label class="form-label">Kết thúc</label>
                  <input type="datetime-local" v-model="promotion.endDate" class="form-control ui-input" />
               </div>
            </div>

            <div class="form-group">
               <label class="form-label">Loại khuyến mại</label>
               <select v-model="promotion.type" class="form-select ui-input">
                  <option v-for="rt in ruleTypes" :key="rt.value" :value="rt.value">
                     {{ rt.label }}
                  </option>
               </select>
            </div>

            <div v-if="promotion.type === 'PERCENT'" class="form-group">
               <label class="form-label">Giảm theo %</label>
               <input type="number" v-model.number="promotion.discountPercent" class="form-control ui-input" />
            </div>

            <div v-if="promotion.type === 'AMOUNT'" class="form-group">
               <label class="form-label">Giảm giá cố định</label>
               <input type="number" v-model.number="promotion.discountAmount" class="form-control ui-input" />
            </div>

            <div class="form-group">
               <label class="form-label">Poster</label>
               <input type="file" @change="onFileChange" class="form-control ui-input small-file" />
            </div>

            <div class="btn-group-footer">
               <button class="btn ui-btn-secondary" @click="goBack">Quay lại</button>
               <button class="btn ui-btn-primary flex-grow-1" @click="savePromotion">
                  Lưu & Tiếp
               </button>
            </div>
         </div>

         <!-- STEP 2 -->
         <div v-show="step === 1" class="step-container fade-in">
            <h5 class="section-title">Chọn sản phẩm áp dụng</h5>

            <input
               v-model="searchQuery"
               placeholder="Tìm sản phẩm..."
               class="form-control ui-input mb-3"
            />

            <table class="table table-hover table-custom">
               <thead>
                  <tr>
                     <th></th>
                     <th>Ảnh</th>
                     <th>Tên</th>
                     <th>Mô tả</th>
                     <th>Note</th>
                  </tr>
               </thead>

               <tbody>
                  <tr v-for="p in paginatedProducts" :key="p.id">
                     <td>
                        <input type="checkbox" v-model="selectedProducts" :value="p.id" />
                     </td>
                     <td>
                        <img :src="IMG + p.poster" class="product-img" />
                     </td>
                     <td>{{ p.name }}</td>
                     <td>{{ p.description }}</td>
                     <td>
                        <input v-model="productNotes[p.id]" class="form-control ui-input" />
                     </td>
                  </tr>
               </tbody>
            </table>

            <div class="btn-group-footer">
               <button class="btn ui-btn-secondary" @click="step--">Quay lại</button>
               <button class="btn ui-btn-primary flex-grow-1" @click="applyProducts">
                  Lưu & Tiếp
               </button>
            </div>
         </div>

         <!-- STEP 3 -->
         <div v-show="step === 2" class="step-container fade-in">
            <h5 class="section-title">Luật áp dụng</h5>

            <div class="rule-box">
               <div class="row g-2">
                  <div class="col-md-4">
                     <label class="form-label">Loại luật</label>
                     <select v-model="newRule.ruleType" class="form-select ui-input">
                        <option v-for="rt in ruleTypes" :value="rt.value">{{ rt.label }}</option>
                     </select>
                  </div>

                  <div class="col-md-8">

                     <div v-if="['PERCENT','TOTAL_PERCENT'].includes(newRule.ruleType)">
                        <label class="form-label">% giảm</label>
                        <input type="number" v-model.number="newRule.percent" class="form-control ui-input" />
                     </div>

                     <div v-if="newRule.ruleType === 'BUY_X_GET_Y'" class="d-flex gap-2">
                        <div>
                           <label class="form-label">Mua X</label>
                           <input type="number" v-model.number="newRule.buy" class="form-control ui-input" />
                        </div>
                        <div>
                           <label class="form-label">Tặng Y</label>
                           <input type="number" v-model.number="newRule.get" class="form-control ui-input" />
                        </div>
                     </div>

                     <div v-if="newRule.ruleType === 'FIXED_COMBO'">
                        <label class="form-label">Sản phẩm combo</label>
                        <div class="combo-container">
                           <div
                              v-for="p in products"
                              :key="p.id"
                              class="combo-item"
                              :class="{ active: newRule.items.some(i => i.name === p.name) }"
                              @click="toggleComboItem(p)"
                           >
                              <img :src="IMG + p.poster" class="combo-img" />
                              <div class="combo-name">{{ p.name }}</div>
                           </div>
                        </div>

                        <label class="form-label">Giá combo</label>
                        <input type="number" v-model.number="newRule.price" class="form-control ui-input" />
                     </div>
                  </div>

                  <div class="col-md-2 d-flex align-items-end">
                     <button class="btn ui-btn-primary w-100" @click="addNewRule">Thêm luật</button>
                  </div>
               </div>
            </div>

            <table class="table table-custom text-center mt-3">
               <thead>
                  <tr>
                     <th>Loại luật</th>
                     <th>Điều kiện</th>
                     <th>Hành động</th>
                  </tr>
               </thead>

               <tbody>
                  <tr v-for="r in rules" :key="r.id">
                     <td>{{ r.label }}</td>

                     <td>
                        <div v-if="r.label === 'FIXED_COMBO'">
                           <strong>Giá: {{ r.condition.price }} ₫</strong>

                           <div class="combo-preview">
                              <div v-for="item in r.condition.items" :key="item.name" class="combo-preview-item">
                                 <img :src="IMG + item.poster" />
                                 <div>{{ item.name }}</div>
                              </div>
                           </div>
                        </div>

                        <div v-else-if="['PERCENT','TOTAL_PERCENT'].includes(r.label)">
                           Giảm: <strong>{{ r.condition.percent }} %</strong>
                        </div>

                        <div v-else-if="r.label === 'BUY_X_GET_Y'">
                           Mua <strong>{{ r.condition.buy }}</strong> – tặng <strong>{{ r.condition.get }}</strong>
                        </div>
                     </td>

                     <td>
                        <button class="btn btn-success btn-sm" @click="applyRule(r.id)">Áp dụng</button>
                        <button class="btn btn-danger btn-sm" @click="removeRule(r)">Xóa</button>
                     </td>
                  </tr>
               </tbody>
            </table>

            <div class="btn-group-footer">
               <button class="btn ui-btn-secondary" @click="step--">Quay lại</button>
               <button class="btn ui-btn-primary flex-grow-1" @click="finishPromotion">
                  Hoàn tất
               </button>
            </div>
         </div>
      </div>
   </div>
</template>


<script setup>
   import { ref, computed, watch, onMounted } from 'vue';
   import axios from 'axios';
   import Swal from 'sweetalert2';
   import { debounce } from 'lodash';

   const props = defineProps({ promotionData: Object });
   const emit = defineEmits(['saved', 'close', 'reload']);

   const step = ref(0);
   const API_PROMO = import.meta.env.VITE_API_BASE_URL + '/admin/promotions';
   const API_PRODUCT = import.meta.env.VITE_API_BASE_URL + '/admin/products';
   const IMG = import.meta.env.VITE_IMAGE_URL;

   const promotion = ref({
      id: null,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'PERCENT',
      discountPercent: 0,
      discountAmount: 0,
      posterFile: null,
   });

   const products = ref([]);
   const selectedProducts = ref([]);
   const productNotes = ref({});
   const searchQuery = ref('');
   const itemsPerPage = 6;
   const currentPage = ref(1);
   const rules = ref([]);

   const ruleTypes = [
      { value: 'PERCENT', label: 'Giảm theo %' },
      { value: 'BUY_X_GET_Y', label: 'Mua X tặng Y' },
      { value: 'FIXED_COMBO', label: 'Combo giá cố định' },
      { value: 'TOTAL_PERCENT', label: 'Giảm tổng tiền %' },
   ];

   const newRule = ref({ ruleType: 'PERCENT', percent: 0, buy: 0, get: 0, items: [], price: 0 });

   // Computed
   const filteredProducts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return q ? products.value.filter((p) => p.name.toLowerCase().includes(q)) : products.value;
   });

   const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredProducts.value.slice(start, start + itemsPerPage);
   });

   // Debounce search
   watch(
      searchQuery,
      debounce(() => {
         currentPage.value = 1;
      }, 300)
   );

   // Load products
   onMounted(() => {
      axios.get(API_PRODUCT).then((res) => (products.value = res.data));
   });

   // Watch edit mode
   watch(
      () => props.promotionData,
      (data) => {
         if (!data) {
            rules.value = [];
            selectedProducts.value = [];
            productNotes.value = {};
            return;
         }

         Object.assign(promotion.value, {
            ...data,
            startDate: data.startDate + 'T00:00',
            endDate: data.endDate + 'T23:59',
         });

         selectedProducts.value = data.items?.map((i) => i.productId) || [];
         productNotes.value = {};
         data.items?.forEach((i) => {
            productNotes.value[i.productId] = i.note || '';
         });

         rules.value = (data.rules || []).map((r) => {
            let ruleVal = r.ruleValue;
            if (typeof ruleVal === 'string') {
               try {
                  ruleVal = JSON.parse(ruleVal);
               } catch {
                  ruleVal = {};
               }
            }
            if (r.ruleType === 'FIXED_COMBO') {
               ruleVal.items = (ruleVal.items || []).map((name) => {
                  const p = products.value.find((x) => x.name === name);
                  return { name, poster: p ? p.poster : '' };
               });
            }
            return { id: r.id, label: r.ruleType, condition: ruleVal, isNew: false };
         });

         step.value = 0;
      },
      { immediate: true }
   );

   // Functions
   function goBack() {
      emit('close');
      emit('reload');
   }
   function onFileChange(e) {
      promotion.value.posterFile = e.target.files[0];
   }

   function savePromotion() {
      if (!promotion.value.name.trim()) return toast('Tên chương trình không được trống', 'error');

      const fd = new FormData();
      fd.append('name', promotion.value.name);
      fd.append('description', promotion.value.description);
      fd.append('startDate', promotion.value.startDate.split('T')[0]);
      fd.append('endDate', promotion.value.endDate.split('T')[0]);
      fd.append('type', promotion.value.type);
      fd.append('discountPercent', promotion.value.discountPercent || 0);
      fd.append('discountAmount', promotion.value.discountAmount || 0);
      if (promotion.value.posterFile) {
         fd.append('posterFile', promotion.value.posterFile);
      }

      const req = promotion.value.id
         ? axios.put(API_PROMO + '/' + promotion.value.id, fd)
         : axios.post(API_PROMO, fd).then((res) => (promotion.value.id = res.data.id));

      req.then(() => {
         step.value = 1;
         toast('Lưu thành công', 'success');
      }).catch(() => toast('Lỗi lưu promotion', 'error'));
   }

   function applyProducts() {
      if (!promotion.value.id) return toast('Promotion chưa được tạo', 'error');

      // Lọc chỉ những product mới
      const existingIds = props.promotionData?.items?.map((i) => i.productId) || [];
      const newItems = selectedProducts.value
         .filter((id) => !existingIds.includes(id))
         .map((id) => ({ productId: id, note: productNotes.value[id] || '' }));

      if (!newItems.length) {
         step.value = 2; // không có gì mới, chuyển luôn
         return toast('Không có sản phẩm mới để thêm', 'info');
      }

      axios
         .post(`${API_PROMO}/${promotion.value.id}/items`, newItems)
         .then(() => {
            step.value = 2;
            toast('Đã áp dụng sản phẩm', 'success');
         })
         .catch(() => toast('Lỗi áp dụng sản phẩm', 'error'));
   }

   function addNewRule() {
      let condition = {};
      if (['PERCENT', 'TOTAL_PERCENT'].includes(newRule.value.ruleType))
         condition = { percent: newRule.value.percent };
      else if (newRule.value.ruleType === 'BUY_X_GET_Y')
         condition = { buy: newRule.value.buy, get: newRule.value.get };
      else if (newRule.value.ruleType === 'FIXED_COMBO')
         condition = { items: [...newRule.value.items], price: newRule.value.price };

      rules.value.push({ id: Date.now(), label: newRule.value.ruleType, condition, isNew: true });
      newRule.value = { ruleType: 'PERCENT', percent: 0, buy: 0, get: 0, items: [], price: 0 };
   }

   function applyRule(ruleId) {
      const rule = rules.value.find((r) => r.id === ruleId);
      if (!rule) return;
      axios
         .post(`${API_PROMO}/${promotion.value.id}/rules`, [
            { ruleType: rule.label, ruleValue: rule.condition },
         ])
         .then(() => {
            rule.isNew = false;
            toast('Áp dụng thành công', 'success');
         })
         .catch(() => toast('Lỗi áp dụng rule', 'error'));
   }

   function removeRule(rule) {
      if (!promotion.value.id) return;
      if (rule.isNew) {
         rules.value = rules.value.filter((r) => r.id !== rule.id);
         return;
      }

      Swal.fire({
         title: 'Xác nhận',
         text: 'Bạn có chắc chắn muốn xóa luật này?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xóa',
         cancelButtonText: 'Hủy',
      }).then((result) => {
         if (result.isConfirmed) {
            axios
               .delete(`${API_PROMO}/rules/${rule.id}`)
               .then(() => {
                  rules.value = rules.value.filter((r) => r.id !== rule.id);
                  toast('Đã xóa luật', 'success');
               })
               .catch(() => toast('Lỗi khi xóa luật', 'error'));
         }
      });
   }

   function finishPromotion() {
      Swal.fire('Hoàn tất', 'Promotion đã được lưu!', 'success').then(() => {
         emit('saved');
         emit('reload');
      });
   }

   function toast(msg, type) {
      Swal.fire({ icon: type, text: msg, timer: 1800, showConfirmButton: false });
   }

   function toggleComboItem(p) {
      newRule.value.items = newRule.value.items.some((i) => i.name === p.name)
         ? newRule.value.items.filter((i) => i.name !== p.name)
         : [...newRule.value.items, { name: p.name, poster: p.poster }];
   }
</script>

<style scoped>
.promo-wrapper {
   padding: 20px;
}

.promo-card {
   background: #fff;
   padding: 20px;
   border-radius: 20px;
   box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}

.promo-steps {
   margin-bottom: 25px;
}

/* Form */
.form-group {
   margin-bottom: 16px;
}

.form-label {
   font-weight: 600;
   margin-bottom: 6px;
   display: block;
}

.ui-input {
   border-radius: 12px !important;
   padding: 10px 14px !important;
}

.ui-textarea {
   border-radius: 12px;
   padding: 12px 14px;
}

/* Buttons */
.btn-group-footer {
   margin-top: 20px;
   display: flex;
   gap: 14px;
   justify-content: space-between;
}

.ui-btn-primary {
   background: #2ecc71 !important;
   border: none !important;
   color: #fff !important;
   padding: 10px 18px;
   border-radius: 30px;
   font-weight: 600;
}

.ui-btn-primary:hover {
   background: #27ae60 !important;
}

.ui-btn-secondary {
   background: #ecf0f1 !important;
   border: none;
   padding: 10px 18px;
   border-radius: 30px;
   font-weight: 600;
}

/* Table */
.table-custom thead {
   background: #e9f7ef;
   font-weight: 600;
}

.product-img {
   width: 60px;
   height: 60px;
   object-fit: cover;
   border-radius: 10px;
}

/* Combo */
.combo-container {
   display: flex;
   flex-wrap: wrap;
   gap: 10px;
}

.combo-item {
   width: 90px;
   padding: 6px;
   border: 2px solid transparent;
   border-radius: 12px;
   text-align: center;
   cursor: pointer;
   transition: 0.2s;
}

.combo-item.active {
   border-color: #2ecc71;
   background: #eafaf1;
}

.combo-img {
   width: 70px;
   height: 70px;
   border-radius: 10px;
   object-fit: cover;
}

.combo-name {
   font-size: 12px;
   margin-top: 4px;
}

.combo-preview {
   display: flex;
   justify-content: center;
   flex-wrap: wrap;
   gap: 8px;
}

.combo-preview-item img {
   width: 50px;
   height: 50px;
   border-radius: 10px;
   object-fit: cover;
}

.small-file {
  padding: 4px 8px !important;
  font-size: 13px !important;
  height: 36px !important;
  line-height: 26px !important;
}


/* Animation */
.fade-in {
   animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
   from { opacity: 0; transform: translateY(10px); }
   to   { opacity: 1; transform: translateY(0); }
}
</style>

