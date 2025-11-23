<template>
   <div class="promo-wrapper">
      <!-- STEP NAVIGATION -->
      <el-steps :active="step" finish-status="success" class="promo-steps">
         <el-step title="Tạo chương trình" />
         <el-step title="Chọn sản phẩm" />
         <el-step title="Luật áp dụng" />
         <el-step title="Tóm tắt" />
      </el-steps>

      <!-- MAIN CARD -->
      <el-card class="promo-card shadow">
         <!-- ==================================================== -->
         <!-- STEP 1: THÔNG TIN CHUNG -->
         <!-- ==================================================== -->
         <el-form v-show="step === 0" :model="promotion" label-width="130px" size="small">
            <el-form-item label="Tên chương trình *">
               <el-input v-model="promotion.name" placeholder="Nhập tên chương trình" clearable />
            </el-form-item>

            <el-form-item label="Mô tả *">
               <el-input v-model="promotion.description" type="textarea" rows="3" />
            </el-form-item>

            <el-row :gutter="20">
               <el-col :span="12">
                  <el-form-item label="Bắt đầu">
                     <el-date-picker
                        v-model="promotion.startDate"
                        type="datetime"
                        class="w-full"
                        :disabled-date="disablePastDates"
                     />
                  </el-form-item>
               </el-col>

               <el-col :span="12">
                  <el-form-item label="Kết thúc">
                     <el-date-picker
                        v-model="promotion.endDate"   
                        type="datetime"
                        class="w-full"
                        :disabled-date="disablePastDates"
                     />
                  </el-form-item>
               </el-col>
            </el-row>

            <el-form-item label="Loại khuyến mại">
               <el-select v-model="promotion.type">
                  <el-option
                     v-for="opt in ruleTypes"
                     :key="opt.value"
                     :label="opt.label"
                     :value="opt.value"
                  />
               </el-select>
            </el-form-item>

            <el-form-item v-if="promotion.type === 'PERCENT'" label="Giảm %">
               <el-input-number v-model="promotion.discountPercent" :min="0" :max="100" />
            </el-form-item>

            <el-form-item v-if="promotion.type === 'AMOUNT'" label="Giảm cố định">
               <el-input-number v-model="promotion.discountAmount" :min="0" />
            </el-form-item>

            <el-form-item label="Poster">
               <el-upload
                  :show-file-list="false"
                  :before-upload="handleFile"
                  :on-change="previewPoster"
               >
                  <el-button type="primary">Chọn file</el-button>
               </el-upload>

               <div class="mt-2 text-center">
                  <el-image v-if="posterPreview" :src="posterPreview" class="poster-preview" />
                  <el-image
                     v-else-if="promotion.poster"
                     :src="IMG + promotion.poster"
                     class="poster-preview"
                  />
               </div>
            </el-form-item>

            <div class="btn-footer">
               <el-button @click="$emit('close')">Hủy</el-button>
               <el-button type="primary" @click="savePromotion">Lưu & Tiếp</el-button>
            </div>
         </el-form>

         <!-- ==================================================== -->
         <!-- STEP 2: CHỌN SẢN PHẨM -->
         <!-- ==================================================== -->
         <div v-show="step === 1">
            <el-input v-model="searchQuery" placeholder="Tìm sản phẩm..." clearable class="mb-3" />

            <el-table
               ref="tableRef"
               :data="paginatedProducts"
               border
               stripe
               size="small"
               @selection-change="handleSelectionChange"
            >
               <el-table-column type="selection" width="55" />

               <el-table-column label="Ảnh" width="90">
                  <template #default="{ row }">
                     <div class="table-img-box">
                        <el-image :src="IMG + row.poster" class="table-thumb" />

                        <!-- Tag đánh dấu sản phẩm đã áp dụng -->
                        <el-tag
                           v-if="appliedProductIds.includes(row.id)"
                           size="small"
                           type="success"
                           class="applied-tag"
                        >
                           Đã áp dụng
                        </el-tag>
                     </div>
                  </template>
               </el-table-column>

               <el-table-column prop="name" label="Tên" />
               <el-table-column prop="description" label="Mô tả" />

               <el-table-column label="Ghi chú">
                  <template #default="{ row }">
                     <el-input v-model="productNotes[row.id]" size="small" />
                  </template>
               </el-table-column>
            </el-table>

            <div class="pagination-bar">
               <el-pagination
                  background
                  layout="prev, pager, next"
                  :page-size="itemsPerPage"
                  :total="filteredProducts.length"
                  v-model:current-page="currentPage"
               />
            </div>

            <div class="btn-footer">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="applyProducts">Lưu & Tiếp</el-button>
            </div>
         </div>

         <!-- ==================================================== -->
         <!-- STEP 3: LUẬT ÁP DỤNG -->
         <!-- ==================================================== -->
         <div v-show="step === 2">
            <el-form label-width="130px" size="small">
               <el-form-item label="Loại luật">
                  <el-select v-model="newRule.ruleType">
                     <el-option
                        v-for="rt in filteredRuleTypes"
                        :key="rt.value"
                        :label="rt.label"
                        :value="rt.value"
                     />
                  </el-select>
               </el-form-item>

               <el-form-item
                  v-if="['PERCENT', 'TOTAL_PERCENT'].includes(newRule.ruleType)"
                  label="% giảm"
               >
                  <el-input-number v-model="newRule.percent" :min="0" :max="100" />
               </el-form-item>

               <el-form-item v-if="newRule.ruleType === 'BUY_X_GET_Y'" label="Mua X / Tặng Y">
                  <el-input-number v-model="newRule.buy" :min="0" />
                  <el-input-number v-model="newRule.get" class="ml-2" :min="0" />
               </el-form-item>

               <!-- COMBO -->
               <div v-if="newRule.ruleType === 'FIXED_COMBO'" class="combo-container">
                  <div class="combo-grid">
                     <div
                        v-for="p in products"
                        :key="p.id"
                        class="combo-item"
                        :class="{ selected: isComboSelected(p) }"
                        @click="toggleComboItem(p)"
                     >
                        <div v-if="isComboSelected(p)" class="combo-tick">✓</div>

                        <el-card class="combo-card" shadow="hover">
                           <el-image :src="IMG + p.poster" class="combo-image" />
                           <div class="combo-title">{{ p.name }}</div>
                        </el-card>
                     </div>
                  </div>

                  <el-input-number
                     v-model="newRule.price"
                     :min="1000"
                     placeholder="Giá combo"
                     style="margin-top: 12px; width: 200px"
                  />
               </div>

               <el-form-item>
                  <el-button type="primary" @click="addNewRule">Thêm luật</el-button>
               </el-form-item>
            </el-form>

            <!-- RULE TABLE -->
            <el-table :data="rules" stripe border size="small" class="mt-3">
               <el-table-column prop="label" label="Loại" width="160" />

               <el-table-column label="Điều kiện">
                  <template #default="{ row }">
                     <!-- % giảm -->
                     <template v-if="row.label === 'PERCENT' || row.label === 'TOTAL_PERCENT'">
                        Giảm: <b>{{ row.condition.percent }}%</b>
                     </template>

                     <!-- Mua X tặng Y -->
                     <template v-else-if="row.label === 'BUY_X_GET_Y'">
                        Mua <b>{{ row.condition.buy }}</b> — Tặng <b>{{ row.condition.get }}</b>
                     </template>

                     <!-- Combo cố định -->
                     <template v-else-if="row.label === 'FIXED_COMBO'">
                        <div style="margin-bottom: 6px">
                           <b>Giá combo: {{ row.condition.price }}₫</b>
                        </div>

                        <div class="combo-preview">
                           <div
                              v-for="item in row.condition.items"
                              :key="item.name"
                              class="combo-preview-item"
                           >
                              <el-image :src="IMG + item.poster" class="combo-thumb" />
                              <div class="combo-name">{{ item.name }}</div>
                           </div>
                        </div>
                     </template>

                     <!-- Fallback -->
                     <template v-else>
                        <pre style="white-space: pre-wrap; font-size: 12px">
                            {{ row.condition }}
                        </pre>
                     </template>
                  </template>
               </el-table-column>

               <el-table-column label="Hành động" width="180">
                  <template #default="{ row }">
                     <el-button size="small" type="success" @click="applyRule(row.id)"
                        >Áp dụng</el-button
                     >
                     <el-button size="small" type="danger" @click="removeRule(row)">Xóa</el-button>
                  </template>
               </el-table-column>
            </el-table>

            <div class="btn-footer mt-3">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="step = 3">Tiếp >></el-button>
            </div>
         </div>

         <!-- ==================================================== -->
         <!-- STEP 4: TÓM TẮT -->
         <!-- ==================================================== -->
         <div v-show="step === 3" class="summary-screen">
            <div class="summary-poster">
               <el-image v-if="posterPreview" :src="posterPreview" class="summary-image" />
               <el-image
                  v-else-if="promotion.poster"
                  :src="IMG + promotion.poster"
                  class="summary-image"
               />
               <div v-else class="summary-placeholder"></div>
            </div>

            <el-descriptions column="1" border title="Thông tin chương trình">
               <el-descriptions-item label="Tên">{{ promotion.name }}</el-descriptions-item>
               <el-descriptions-item label="Mô tả">{{
                  promotion.description
               }}</el-descriptions-item>
               <el-descriptions-item label="Bắt đầu">{{
                  formatDate(promotion.startDate)
               }}</el-descriptions-item>
               <el-descriptions-item label="Kết thúc">{{
                  formatDate(promotion.endDate)
               }}</el-descriptions-item>
               <el-descriptions-item label="Loại">{{ promotion.type }}</el-descriptions-item>
               <el-descriptions-item label="Giảm %">{{
                  promotion.discountPercent
               }}</el-descriptions-item>
               <el-descriptions-item label="Giảm cố định">{{
                  promotion.discountAmount
               }}</el-descriptions-item>
            </el-descriptions>

            <div class="mt-3">
               <h4>Sản phẩm áp dụng</h4>
               <template v-if="selectedProducts.length">
                  <el-tag
                     v-for="p in selectedProducts"
                     :key="p.id"
                     type="success"
                     class="mr-1 mb-1"
                  >
                     {{ p.name }}
                  </el-tag>
               </template>
               <div v-else class="text-gray-500">Chưa chọn sản phẩm</div>
            </div>

            <div class="mt-3">
               <h4>Luật áp dụng</h4>
               <template v-if="rules.length">
                  <el-tag v-for="r in rules" :key="r.id" type="warning" class="mr-1 mb-1">
                     {{ r.label }}
                  </el-tag>
               </template>
               <div v-else class="text-gray-500">Chưa có luật</div>
            </div>

            <div class="btn-footer mt-4">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="finishPromotion">Hoàn tất</el-button>
            </div>
         </div>
      </el-card>
   </div>
</template>

<script setup>
   import { ref, computed, watch, onMounted, nextTick } from 'vue';
   import axios from 'axios';
   import Swal from 'sweetalert2';
   import { debounce } from 'lodash';

   const props = defineProps({
      promotionData: Object,
   });

   const ruleMapping = {
      PERCENT: 'PERCENT',
      TOTAL_PERCENT: 'TOTAL_PERCENT',

      // Nếu chương trình là mua X tặng Y
      BUY_X_GET_Y: 'BUY_X_GET_Y',

      // Nếu chương trình là combo cố định
      FIXED_COMBO: 'FIXED_COMBO',
   };

   const filteredRuleTypes = computed(() => {
      const t = promotion.value.type;
      const matched = ruleMapping[t];
      return ruleTypes.filter((r) => r.value === matched);
   });

   const emit = defineEmits(['saved', 'close', 'reload']);

   /* ========================= */
   /* STATE */
   /* ========================= */

   const step = ref(0);

   const API_PROMO = import.meta.env.VITE_API_BASE_URL + '/admin/promotions';
   const API_PRODUCT = import.meta.env.VITE_API_BASE_URL + '/products';
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
      poster: '',
      posterFile: null,
   });

   const posterPreview = ref(null);
   const products = ref([]);
   const allPromotions = ref([]);

   const selectedProducts = ref([]);
   const productNotes = ref({});
   const searchQuery = ref('');
   const itemsPerPage = 6;
   const currentPage = ref(1);
   const touchedProductSelection = ref(false);

   const rules = ref([]);
   const tableRef = ref(null);

   /* Rule types */
   const ruleTypes = [
      { value: 'PERCENT', label: 'Giảm theo %' },
      { value: 'BUY_X_GET_Y', label: 'Mua X tặng Y' },
      { value: 'FIXED_COMBO', label: 'Combo giá cố định' },
      { value: 'TOTAL_PERCENT', label: 'Giảm tổng tiền %' },
   ];

   /* New Rule */
   const newRule = ref({
      ruleType: 'PERCENT',
      percent: 0,
      buy: 0,
      get: 0,
      items: [],
      price: 0,
   });

   /* ========================= */
   /* COMPUTED */
   /* ========================= */

   const appliedProductIds = computed(() =>
      (props.promotionData?.items || []).map((i) => i.productId)
   );

   const filteredProducts = computed(() => {
      const q = searchQuery.value.trim().toLowerCase();
      return q ? products.value.filter((p) => p.name.toLowerCase().includes(q)) : products.value;
   });

   const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredProducts.value.slice(start, start + itemsPerPage);
   });

   /* ========================= */
   /* WATCH */
   /* ========================= */

   watch(
      searchQuery,
      debounce(() => (currentPage.value = 1), 300)
   );

   watch(
      () => props.promotionData,
      async (data) => {
         if (!data) {
            rules.value = [];
            selectedProducts.value = [];
            productNotes.value = {};
            posterPreview.value = null;
            return;
         }

         /* GÁN THÔNG TIN CHƯƠNG TRÌNH */
         Object.assign(promotion.value, {
            ...data,
            startDate: data.startDate + 'T00:00',
            endDate: data.endDate + 'T23:59',
         });

         posterPreview.value = null;

         /* CHỜ PRODUCTS LOAD XONG */
         await nextTick();

         /* ============================= */
         /* STEP 2 — LOAD SELECTED ITEMS */
         /* ============================= */
         const oldItems = data.items || [];

         selectedProducts.value = oldItems
            .map((i) => products.value.find((p) => p.id === i.productId))
            .filter(Boolean);

         /* Ghi chú sản phẩm */
         productNotes.value = {};
         oldItems.forEach((i) => {
            productNotes.value[i.productId] = i.note || '';
         });

         /* Tick lại bảng chọn sản phẩm */
         await nextTick();
         if (tableRef.value) {
            tableRef.value.clearSelection();
            products.value.forEach((row) => {
               if (selectedProducts.value.some((p) => p.id === row.id)) {
                  tableRef.value.toggleRowSelection(row, true);
               }
            });
         }

         /* ============================= */
         /* STEP 3 — LOAD RULES */
         /* ============================= */
         rules.value = (data.rules || []).map((r) => {
            let ruleVal = r.ruleValue;

            /* Parse JSON string */
            if (typeof ruleVal === 'string') {
               try {
                  ruleVal = JSON.parse(ruleVal);
               } catch {}
            }

            /* FIXED COMBO FORMAT CHUẨN */
            if (r.ruleType === 'FIXED_COMBO') {
               ruleVal.items = (ruleVal.items || []).map((it) => ({
                  name: it.name,
                  poster: it.poster,
               }));
            }

            return {
               id: r.id,
               label: r.ruleType,
               condition: ruleVal,
               isNew: false,
            };
         });

         /* Reset về bước 0 */
         step.value = 0;
      },
      { immediate: true }
   );

   /* ========================= */
   /* INIT */
   /* ========================= */

   onMounted(async () => {
      /* Load products first */
      const res1 = await axios.get(API_PRODUCT);
      products.value = res1.data;

      /* Load promotions list */
      const res2 = await axios.get(API_PROMO);
      allPromotions.value = res2.data;
   });

   /* ========================= */
   /* UTILS */
   /* ========================= */

   function handleFile(file) {
      promotion.value.posterFile = file;
      return false;
   }

   function previewPoster(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = () => (posterPreview.value = reader.result);
   }

   function formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
         2,
         '0'
      )}-${String(d.getDate()).padStart(2, '0')}`;
   }

   /* ========================= */
   /* STEP 1 */
   /* ========================= */

   function disablePastDates(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date < today; // khóa mọi ngày < hôm nay
   }

   function isDateOverlap(start, end) {
      const ns = new Date(start).getTime();
      const ne = new Date(end).getTime();

      return allPromotions.value.some((p) => {
         // Bỏ qua chính nó khi edit
         if (promotion.value.id && p.id === promotion.value.id) return false;

         const ps = new Date(p.startDate).getTime();
         const pe = new Date(p.endDate).getTime();

         // Overlap rule:
         // (A.start <= B.end) AND (B.start <= A.end)
         return ns <= pe && ps <= ne;
      });
   }

   async function savePromotion() {
      if (!promotion.value.name.trim()) return toast('Tên chương trình không được trống', 'error');

      // Không cho ngày trong quá khứ
      if (new Date(promotion.value.startDate) < new Date().setHours(0, 0, 0, 0)) {
         return toast('Ngày bắt đầu không được nằm trong quá khứ!', 'error');
      }

      if (new Date(promotion.value.endDate) < new Date().setHours(0, 0, 0, 0)) {
         return toast('Ngày kết thúc không được nằm trong quá khứ!', 'error');
      }

      if (!promotion.value.startDate || !promotion.value.endDate)
         return toast('Ngày bắt đầu và kết thúc là bắt buộc', 'error');

      if (isDateOverlap(promotion.value.startDate, promotion.value.endDate)) {
         return toast('Thời gian áp dụng bị trùng với chương trình khác!', 'error');
      }

      if (new Date(promotion.value.endDate) <= new Date(promotion.value.startDate))
         return toast('Ngày kết thúc phải sau ngày bắt đầu', 'error');

      const fd = new FormData();
      fd.append('name', promotion.value.name);
      fd.append('description', promotion.value.description);
      fd.append('startDate', formatDate(promotion.value.startDate));
      fd.append('endDate', formatDate(promotion.value.endDate));
      fd.append('type', promotion.value.type);
      fd.append('discountPercent', promotion.value.discountPercent || 0);
      fd.append('discountAmount', promotion.value.discountAmount || 0);

      if (promotion.value.posterFile) fd.append('posterFile', promotion.value.posterFile);

      const req = promotion.value.id
         ? axios.put(`${API_PROMO}/${promotion.value.id}`, fd)
         : axios.post(API_PROMO, fd).then((res) => (promotion.value.id = res.data.id));

      await req;

      toast('Lưu thành công', 'success');
      step.value = 1;
   }

   /* ========================= */
   /* STEP 2 */
   /* ========================= */

   function handleSelectionChange(val) {
      touchedProductSelection.value = true;
      selectedProducts.value = val;
   }

   async function applyProducts() {
      if (!promotion.value.id) return toast('Promotion chưa được tạo', 'error');

      // PROMOTION MỚI → bắt buộc phải chọn
      if (!props.promotionData && selectedProducts.value.length === 0) {
         return toast('Bạn phải chọn ít nhất 1 sản phẩm!', 'error');
      }

      // PROMOTION CŨ → nếu KHÔNG chạm vào lựa chọn → cho qua
      if (props.promotionData && !touchedProductSelection.value) {
         step.value = 2;
         return;
      }

      // PROMOTION CŨ nhưng đã CHỌN lại → nếu không chọn gì → lỗi
      if (
         props.promotionData &&
         touchedProductSelection.value &&
         selectedProducts.value.length === 0
      ) {
         return toast('Bạn phải chọn ít nhất 1 sản phẩm!', 'error');
      }

      const old = props.promotionData?.items || [];

      const current = selectedProducts.value.map((p) => ({
         productId: p.id,
         note: productNotes.value[p.id] || '',
      }));

      const addList = current.filter((c) => !old.some((o) => o.productId === c.productId));

      const removeList = old.filter((o) => !current.some((c) => c.productId === o.productId));

      const updateList = current.filter((c) => {
         const oldIt = old.find((o) => o.productId === c.productId);
         return oldIt && oldIt.note !== c.note;
      });

      /* No changes → continue */
      if (!addList.length && !removeList.length && !updateList.length) {
         step.value = 2;
         return;
      }

      try {
         if (addList.length) {
            await axios.post(`${API_PROMO}/${promotion.value.id}/items`, addList);
         }

         for (const r of removeList) {
            await axios.delete(`${API_PROMO}/${promotion.value.id}/items/${r.productId}`);
         }

         if (updateList.length) {
            await axios.put(`${API_PROMO}/${promotion.value.id}/items`, updateList);
         }

         toast('Cập nhật sản phẩm thành công', 'success');
         emit('reload');
         step.value = 2;
      } catch {
         toast('Lỗi cập nhật sản phẩm', 'error');
      }
   }

   /* ========================= */
   /* STEP 3 – RULES */
   /* ========================= */

   function toggleComboItem(product) {
      const exists = newRule.value.items.find((i) => i.name === product.name);
      if (exists) newRule.value.items = newRule.value.items.filter((i) => i.name !== product.name);
      else
         newRule.value.items.push({
            name: product.name,
            poster: product.poster,
         });
   }

   function isComboSelected(product) {
      return newRule.value.items.some((i) => i.name === product.name);
   }

   function addNewRule() {
      let condition = {};
      if (newRule.value.ruleType !== ruleMapping[promotion.value.type]) {
         toast('Loại luật phải trùng với loại chương trình!', 'error');
         return;
      }
      if (['PERCENT', 'TOTAL_PERCENT'].includes(newRule.value.ruleType)) {
         condition = { percent: newRule.value.percent };
      } else if (newRule.value.ruleType === 'BUY_X_GET_Y') {
         condition = { buy: newRule.value.buy, get: newRule.value.get };
      } else if (newRule.value.ruleType === 'FIXED_COMBO') {
         condition = {
            items: [...newRule.value.items],
            price: newRule.value.price,
         };
      }

      rules.value.push({
         id: Date.now(),
         label: newRule.value.ruleType,
         condition,
         isNew: true,
      });

      newRule.value = {
         ruleType: 'PERCENT',
         percent: 0,
         buy: 0,
         get: 0,
         items: [],
         price: 0,
      };
   }

   async function applyRule(ruleId) {
      const rule = rules.value.find((r) => r.id === ruleId);
      if (!rule) return;

      try {
         await axios.post(`${API_PROMO}/${promotion.value.id}/rules`, [
            {
               ruleType: rule.label,
               ruleValue: rule.condition,
            },
         ]);
         rule.isNew = false;
         toast('Áp dụng thành công', 'success');
      } catch {
         toast('Lỗi áp dụng rule', 'error');
      }
   }

   function removeRule(rule) {
      if (rule.isNew) {
         rules.value = rules.value.filter((r) => r.id !== rule.id);
         return;
      }

      Swal.fire({
         title: 'Xác nhận',
         text: 'Xóa luật này?',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonText: 'Xóa',
         cancelButtonText: 'Hủy',
      }).then(async (res) => {
         if (!res.isConfirmed) return;

         try {
            await axios.delete(`${API_PROMO}/rules/${rule.id}`);
            rules.value = rules.value.filter((r) => r.id !== rule.id);
            toast('Đã xóa', 'success');
         } catch {
            toast('Lỗi xóa rule', 'error');
         }
      });
   }

   /* ========================= */
   /* STEP 4 */
   /* ========================= */

   function finishPromotion() {
      Swal.fire('Hoàn tất', 'Promotion đã được lưu!', 'success').then(() => {
         emit('saved');
         emit('reload');
      });
   }

   /* ========================= */
   /* TOAST */
   /* ========================= */

   function toast(msg, type) {
      Swal.fire({
         icon: type,
         text: msg,
         timer: 1800,
         showConfirmButton: false,
      });
   }
</script>

<style scoped>
   /* ========================= */
   /* Layout */
   /* ========================= */
   .promo-wrapper {
      padding: 20px;
   }

   .promo-card {
      padding: 20px;
      border-radius: 12px;
      background: #fff;
   }

   .promo-steps {
      margin-bottom: 25px;
   }

   /* ========================= */
   /* Poster preview */
   /* ========================= */
   .poster-preview,
   .summary-image {
      width: 150px;
      height: 150px;
      border-radius: 10px;
      object-fit: cover;
   }

   .summary-placeholder {
      width: 150px;
      height: 150px;
      background: #eee;
      border-radius: 10px;
   }

   /* ========================= */
   /* Product Table */
   /* ========================= */
   .table-thumb {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 6px;
   }

   .table-img-box {
      position: relative;
      width: 50px;
   }

   .applied-tag {
      position: absolute;
      bottom: -4px;
      left: 0;
      font-size: 10px;
      padding: 0 4px;
      border-radius: 4px;
   }

   /* Pagination */
   .pagination-bar {
      margin-top: 10px;
      text-align: right;
   }

   /* Footer buttons */
   .btn-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
   }

   /* ========================================================= */
   /* FIXED_COMBO – UI Shopee Mall */
   /* ========================================================= */

   .combo-container {
      width: 100%;
      margin-top: 10px;
   }

   .combo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 18px;
      padding: 10px 2px;
   }

   .combo-item {
      position: relative;
      cursor: pointer;
      transition: 0.2s ease;
   }

   .combo-item:hover {
      transform: translateY(-2px);
   }

   .combo-tick {
      position: absolute;
      top: 6px;
      left: 6px;
      background: #409eff;
      color: #fff;
      font-size: 12px;
      padding: 2px 5px;
      border-radius: 4px;
      z-index: 10;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
   }

   .combo-card {
      border-radius: 10px;
      overflow: hidden;
      text-align: center;
      padding: 0 !important;
      transition:
         border-color 0.2s,
         box-shadow 0.2s;
      border: 1px solid #e0e0e0;
   }

   .combo-item.selected .combo-card {
      border-color: #409eff !important;
      box-shadow: 0 0 8px rgba(64, 158, 255, 0.35);
   }

   .combo-image {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-bottom: 1px solid #f2f2f2;
   }

   .combo-title {
      padding: 8px;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.3;
      height: 36px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   .combo-card:hover {
      border-color: #b7d6ff;
      box-shadow: 0 0 6px rgba(64, 158, 255, 0.25);
   }

   /* ========================= */
   /* Combo Preview – Rule Table */
   /* ========================= */
   .combo-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
   }

   .combo-preview-item {
      width: 50px;
      text-align: center;
   }

   .combo-thumb {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      object-fit: cover;
   }

   .combo-name {
      font-size: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   /* ========================= */
   /* Summary screen */
   /* ========================= */
   .summary-screen {
      padding: 10px 0;
   }

   .summary-poster {
      text-align: center;
      margin-bottom: 15px;
   }

   /* ========================= */
   /* Responsive */
   /* ========================= */
   @media (max-width: 768px) {
      .combo-grid {
         grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      }
      .combo-image {
         height: 90px;
      }
      .combo-title {
         font-size: 12px;
      }
      .poster-preview,
      .summary-image {
         width: 120px;
         height: 120px;
      }
   }
</style>