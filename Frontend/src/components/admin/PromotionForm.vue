<template>
   <div class="promo-wrapper">
      <!-- Stepper -->
      <el-steps :active="step" finish-status="success" class="promo-steps">
         <el-step title="Tạo chương trình" />
         <el-step title="Chọn sản phẩm" />
         <el-step title="Luật áp dụng" />
         <el-step title="Tóm tắt" />
      </el-steps>

      <el-card class="promo-card">
         <!-- STEP 1: Tạo promotion -->
         <el-form v-show="step === 0" :model="promotion" label-width="120px" size="small">
            <el-form-item label="Tên chương trình *">
               <el-input v-model="promotion.name" placeholder="Nhập tên chương trình" />
            </el-form-item>

            <el-form-item label="Mô tả *">
               <el-input type="textarea" v-model="promotion.description" rows="3" />
            </el-form-item>

            <el-form-item label="Bắt đầu">
               <el-date-picker
                  v-model="promotion.startDate"
                  type="datetime"
                  placeholder="Chọn ngày bắt đầu"
               />
            </el-form-item>

            <el-form-item label="Kết thúc">
               <el-date-picker
                  v-model="promotion.endDate"
                  type="datetime"
                  placeholder="Chọn ngày kết thúc"
               />
            </el-form-item>

            <el-form-item label="Loại khuyến mại">
               <el-select v-model="promotion.type" placeholder="Chọn loại khuyến mại">
                  <el-option
                     v-for="rt in ruleTypes"
                     :key="rt.value"
                     :label="rt.label"
                     :value="rt.value"
                  />
               </el-select>
            </el-form-item>

            <el-form-item v-if="promotion.type === 'PERCENT'" label="Giảm theo %">
               <el-input-number v-model="promotion.discountPercent" :min="0" :max="100" />
            </el-form-item>

            <el-form-item v-if="promotion.type === 'AMOUNT'" label="Giảm giá cố định">
               <el-input-number v-model="promotion.discountAmount" :min="0" />
            </el-form-item>

            <el-form-item label="Poster">
               <el-upload
                  :show-file-list="false"
                  :before-upload="handleFile"
                  :on-change="previewPoster"
               >
                  <el-button size="small" type="primary">Chọn file</el-button>
               </el-upload>
               <div v-if="posterPreview" class="mt-2">
                  <el-image
                     :src="posterPreview"
                     style="width: 120px; height: 120px; border-radius: 10px"
                  />
               </div>
               <div v-else-if="promotion.poster && !posterPreview" class="mt-2">
                  <el-image
                     :src="IMG + promotion.poster"
                     style="width: 120px; height: 120px; border-radius: 10px"
                  />
               </div>
            </el-form-item>

            <div class="btn-group-footer">
               <el-button @click="$emit('close')">Hủy</el-button>
               <el-button type="primary" @click="savePromotion">Lưu & Tiếp</el-button>
            </div>
         </el-form>

         <!-- STEP 2: Chọn sản phẩm -->
         <div v-show="step === 1">
            <el-input v-model="searchQuery" placeholder="Tìm sản phẩm..." clearable class="mb-3" />

            <el-table
               :data="paginatedProducts"
               stripe
               size="small"
               border
               row-key="id"
               @selection-change="handleSelectionChange"
            >
               <el-table-column
                  type="selection"
                  width="55"
                  :selectable="() => true"
                  :reserve-selection="true"
               />
               <el-table-column prop="poster" label="Ảnh" width="80">
                  <template #default="scope">
                     <el-image
                        :src="IMG + scope.row.poster"
                        style="width: 50px; height: 50px; border-radius: 6px"
                     />
                  </template>
               </el-table-column>
               <el-table-column prop="name" label="Tên" />
               <el-table-column prop="description" label="Mô tả" />
               <el-table-column label="Note">
                  <template #default="scope">
                     <el-input v-model="productNotes[scope.row.id]" size="small" />
                  </template>
               </el-table-column>
            </el-table>

            <div class="mt-2" style="text-align: right">
               <el-pagination
                  background
                  :page-size="itemsPerPage"
                  :current-page.sync="currentPage"
                  :total="filteredProducts.length"
                  layout="prev, pager, next"
               />
            </div>

            <div class="btn-group-footer">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="applyProducts">Lưu & Tiếp</el-button>
            </div>
         </div>

         <!-- STEP 3: Luật áp dụng -->
         <div v-show="step === 2">
            <h5>Luật áp dụng</h5>
            <el-form label-width="120px" size="small">
               <el-form-item label="Loại luật">
                  <el-select v-model="newRule.ruleType" placeholder="Chọn loại luật">
                     <el-option
                        v-for="rt in ruleTypes"
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
                  <el-input-number v-model="newRule.buy" :min="0" placeholder="Mua X" />
                  <el-input-number v-model="newRule.get" :min="0" placeholder="Tặng Y" />
               </el-form-item>

               <el-form-item v-if="newRule.ruleType === 'FIXED_COMBO'" label="Combo sản phẩm">
                  <el-checkbox-group v-model="newRule.items">
                     <el-checkbox
                        v-for="p in products"
                        :key="p.id"
                        :label="{ name: p.name, poster: p.poster }"
                     >
                        <el-card
                           :body-style="{ padding: '5px', textAlign: 'center' }"
                           shadow="hover"
                        >
                           <el-image
                              :src="IMG + p.poster"
                              style="
                                 width: 70px;
                                 height: 70px;
                                 object-fit: cover;
                                 border-radius: 6px;
                              "
                           />
                           <div style="font-size: 12px; margin-top: 4px">{{ p.name }}</div>
                        </el-card>
                     </el-checkbox>
                  </el-checkbox-group>
                  <el-input-number v-model="newRule.price" :min="0" placeholder="Giá combo" />
               </el-form-item>

               <el-form-item>
                  <el-button type="primary" @click="addNewRule">Thêm luật</el-button>
               </el-form-item>
            </el-form>

            <el-table :data="rules" stripe size="small" border style="margin-top: 20px">
               <el-table-column prop="label" label="Loại luật" />
               <el-table-column label="Điều kiện">
                  <template #default="scope">
                     <div v-if="scope.row.label === 'FIXED_COMBO'">
                        <strong>Giá: {{ scope.row.condition.price }} ₫</strong>
                        <div class="combo-preview">
                           <div
                              v-for="item in scope.row.condition.items"
                              :key="item.name"
                              class="combo-preview-item"
                           >
                              <el-image
                                 :src="IMG + item.poster"
                                 style="width: 50px; height: 50px; border-radius: 6px"
                              />
                              <div>{{ item.name }}</div>
                           </div>
                        </div>
                     </div>
                     <div v-else-if="['PERCENT', 'TOTAL_PERCENT'].includes(scope.row.label)">
                        Giảm: <strong>{{ scope.row.condition.percent }}%</strong>
                     </div>
                     <div v-else-if="scope.row.label === 'BUY_X_GET_Y'">
                        Mua <strong>{{ scope.row.condition.buy }}</strong> – Tặng
                        <strong>{{ scope.row.condition.get }}</strong>
                     </div>
                  </template>
               </el-table-column>
               <el-table-column label="Hành động">
                  <template #default="scope">
                     <el-button type="success" size="small" @click="applyRule(scope.row.id)"
                        >Áp dụng</el-button
                     >
                     <el-button type="danger" size="small" @click="removeRule(scope.row)"
                        >Xóa</el-button
                     >
                  </template>
               </el-table-column>
            </el-table>

            <div class="btn-group-footer" style="margin-top: 20px">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="step = 3">Tiếp &gt;&gt;</el-button>
            </div>
         </div>

         <!-- STEP 4: Tóm tắt & Hoàn tất -->
         <div v-show="step === 3" class="mt-4">
            <h3 class="mb-3">Tóm tắt chương trình khuyến mại</h3>

            <div class="mb-3 text-center">
               <el-image
                  v-if="posterPreview"
                  :src="posterPreview"
                  style="width: 150px; height: 150px; border-radius: 10px"
               />
               <el-image
                  v-else-if="promotion.poster"
                  :src="IMG + promotion.poster"
                  style="width: 150px; height: 150px; border-radius: 10px"
               />
               <div v-else class="bg-gray-200 w-36 h-36 inline-block rounded-xl"></div>
            </div>

            <el-descriptions title="Thông tin chương trình" column="1" border>
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
               <h4>Sản phẩm áp dụng:</h4>
               <el-tag v-for="p in selectedProducts" :key="p.id" type="success" class="mr-2 mb-2">{{
                  p.name
               }}</el-tag>
               <div v-if="!selectedProducts.length" class="text-gray-500">Chưa chọn sản phẩm</div>
            </div>

            <div class="mt-3">
               <h4>Luật áp dụng:</h4>
               <el-tag v-for="r in rules" :key="r.id" type="warning" class="mr-2 mb-2">
                  {{ r.label }}
                  <span v-if="r.condition.percent">({{ r.condition.percent }}%)</span>
                  <span v-else-if="r.condition.buy"
                     >Mua {{ r.condition.buy }} tặng {{ r.condition.get }}</span
                  >
                  <span v-else-if="r.condition.items"
                     >Combo: {{ r.condition.items.map((i) => i.name).join(',') }} - Giá:
                     {{ r.condition.price }}</span
                  >
               </el-tag>
               <div v-if="!rules.length" class="text-gray-500">Chưa có luật</div>
            </div>

            <div class="mt-4 btn-group-footer">
               <el-button @click="step--">Quay lại</el-button>
               <el-button type="primary" @click="finishPromotion">Hoàn tất</el-button>
            </div>
         </div>
      </el-card>
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
      debounce(() => (currentPage.value = 1), 300)
   );

   // Load products
   onMounted(() => {
      axios.get(API_PRODUCT).then((res) => {
         products.value = res.data;
         if (props.promotionData) initSelectedProducts();
      });
   });

   // Watch edit mode
   watch(
      () => props.promotionData,
      (data) => {
         if (!data) {
            rules.value = [];
            selectedProducts.value = [];
            productNotes.value = {};
            posterPreview.value = null;
            return;
         }
         Object.assign(promotion.value, {
            ...data,
            startDate: data.startDate + 'T00:00',
            endDate: data.endDate + 'T23:59',
         });
         posterPreview.value = null;
         initSelectedProducts();
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

   function initSelectedProducts() {
      selectedProducts.value = (props.promotionData.items || [])
         .map((i) => products.value.find((p) => p.id === i.productId))
         .filter(Boolean);
      productNotes.value = {};
      props.promotionData.items?.forEach((i) => {
         productNotes.value[i.productId] = i.note || '';
      });
   }

   // Functions
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
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
   }

   function savePromotion() {
      if (!promotion.value.name.trim()) return toast('Tên chương trình không được trống', 'error');

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

      req.then(() => {
         step.value = 1;
         toast('Lưu thành công', 'success');
      }).catch(() => toast('Lỗi lưu promotion', 'error'));
   }

   function handleSelectionChange(val) {
      selectedProducts.value = val;
   }

   function applyProducts() {
      if (!promotion.value.id) return toast('Promotion chưa được tạo', 'error');
      const newItems = selectedProducts.value.map((p) => ({
         productId: p.id,
         note: productNotes.value[p.id] || '',
      }));
      if (!newItems.length) {
         step.value = 2;
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
</script>

<style scoped>
   .promo-wrapper {
      padding: 20px;
   }
   .promo-card {
      padding: 20px;
      border-radius: 20px;
   }
   .promo-steps {
      margin-bottom: 25px;
   }
   .combo-preview {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
   }
   .combo-preview-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
   }
   .btn-group-footer {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      margin-top: 20px;
   }
</style>
