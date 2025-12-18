<template>
    <div class="min-vh-100 bg-light">
        <div style="padding-bottom: 250px;">
            <Header />
        </div>

        <div class="container py-5" style="padding-top: 160px; max-width: 1400px;">
            <!-- Tiêu đề -->
            <div class="text-center mb-5">
                <h1 class="display-5 fw-bold text-success mb-3">Lịch sử mua vé</h1>
                <p class="text-muted fs-5">Xem lại tất cả hóa đơn bạn đã thanh toán</p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-success" style="width: 4rem; height: 4rem;" role="status">
                    <span class="visually-hidden">Đang tải...</span>
                </div>
                <p class="mt-3 fs-4 text-muted">Đang tải lịch sử...</p>
            </div>

            <!-- Không có lịch sử -->
            <div v-else-if="history.length === 0" class="text-center py-5">
                <i class="bi bi-receipt display-1 text-muted opacity-50"></i>
                <p class="mt-4 fs-3 text-muted">Bạn chưa có hóa đơn nào</p>
                <router-link to="/films" class="btn btn-success btn-lg rounded-pill px-5 py-3 mt-3 shadow">
                    Đặt vé ngay
                </router-link>
            </div>

            <!-- Có lịch sử: Layout 2 cột -->
            <div v-else class="row g-4">
                <!-- Danh sách bên trái -->
                <div class="col-lg-5">
                    <div class="list-group shadow-sm rounded-4 overflow-hidden">
                        <div v-for="item in history" :key="item.invoice?.id"
                            class="list-group-item list-group-item-action border-0 px-4 py-3 cursor-pointer"
                            :class="{ 'bg-light': selectedInvoice?.invoice?.id === item.invoice?.id }"
                            @click="selectInvoice(item)">
                            <div class="d-flex w-100 justify-content-between align-items-start">
                                <div class="flex-grow-1 me-3">
                                    <h6 class="mb-1 fw-bold text-success">
                                        #{{ (item.invoice?.id || '').substring(0, 8).toUpperCase() }}
                                    </h6>
                                    <p class="mb-1 small text-muted">
                                        {{ formatDate(item.invoice?.createdAt) }}
                                    </p>
                                    <p class="mb-1"><strong>{{ item.filmName|| 'Không rõ' }}</strong></p>
                                    <small class="text-muted">
                                        {{ (item.tickets?.length || 0) }} vé • {{ (item.products?.length || 0) }} combo
                                    </small>
                                </div>
                                <div class="text-end">
                                    <h5 class="text-success fw-bold mb-0">{{ formatPrice(item.invoice?.finalAmount) }}đ
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chi tiết bên phải -->
                <div class="col-lg-7" v-if="selectedInvoice">
                    <div class="card shadow rounded-4 h-100 overflow-hidden">
                        <div class="card-header bg-gradient-success text-white py-4">
                            <h4 class="mb-0 fw-bold">
                                Chi tiết hóa đơn #{{ (selectedInvoice.invoice?.id || '').substring(0, 8).toUpperCase()
                                }}
                            </h4>
                            <small class="opacity-90">{{ formatDate(selectedInvoice.invoice?.createdAt) }}</small>
                        </div>
                        <div class="card-body p-4">
                            <div class="row mb-4 pb-4 border-bottom">
                                <div class="col-md-8">
                                    <p class="mb-2"><strong>Khách hàng:</strong> {{
                                        selectedInvoice.invoice?.username?.username || 'Không rõ' }}</p>
                                    <p class="mb-2"><strong>Email:</strong> {{ selectedInvoice.invoice?.username?.email
                                        || 'Không có' }}</p>
                                    <p class="mb-0"><strong>Phim:</strong> {{ selectedInvoice.filmName || 'Không rõ' }}
                                    </p>
                                </div>
                                <div class="col-md-4 text-md-end">
                                    <h2 class="text-success fw-bold mb-0">{{
                                        formatPrice(selectedInvoice.invoice?.finalAmount) }}đ</h2>
                                    <small class="text-muted">Tổng thanh toán</small>
                                </div>
                            </div>

                            <!-- Vé -->
                            <h5 class="fw-bold text-success mb-3 mt-4">Vé xem phim ({{ selectedInvoice.tickets?.length
                                || 0 }} vé)</h5>
                            <div class="table-responsive mb-5">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Ghế</th>
                                            <th>Loại vé</th>
                                            <th class="text-end">Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="ticket in selectedInvoice.tickets || []" :key="ticket.id">
                                            <td><strong class="text-success">{{ ticket.seat?.position || 'N/A'
                                                    }}</strong></td>
                                            <td>{{ ticket.ticketPrice?.name || 'Vé thường' }}</td>
                                            <td class="text-end fw-bold">{{ formatPrice(ticket.price) }}đ</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Combo -->
                            <div v-if="(selectedInvoice.products?.length || 0) > 0">
                                <h5 class="fw-bold text-success mb-3">Combo đã mua</h5>
                                <div class="row g-3">
                                    <div v-for="product in selectedInvoice.products" :key="product.id"
                                        class="col-12 col-md-6">
                                        <div class="d-flex align-items-center bg-light rounded-4 p-3 shadow-sm">
                                            <img :src="posterSrc(product.product?.poster)"
                                                class="rounded me-3 flex-shrink-0"
                                                style="width: 80px; height: 80px; object-fit: cover;" alt="Combo">
                                            <div class="flex-grow-1">
                                                <h6 class="mb-1 fw-bold">{{ product.product?.name || 'Combo' }}</h6>
                                                <small class="text-muted">Số lượng: {{ product.quantity }}</small>
                                            </div>
                                            <strong class="text-success fs-5">{{ formatPrice(product.price *
                                                product.quantity) }}đ</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-4 text-muted">
                                <i class="bi bi-cup-straw fs-1"></i>
                                <p class="mt-2">Không có combo</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chưa chọn hóa đơn (desktop) -->
                <div v-else class="col-lg-7 d-flex align-items-center justify-content-center">
                    <div class="text-center text-muted">
                        <i class="bi bi-receipt display-1 opacity-50"></i>
                        <p class="mt-3 fs-4">Chọn một hóa đơn để xem chi tiết</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted} from 'vue' 
import { useRouter } from 'vue-router'
import axios from 'axios'
import Header from '../header/Header.vue'
import { jwtDecode } from 'jwt-decode'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

const router = useRouter()

const history = ref([])
const loading = ref(true)
const selectedInvoice = ref(null)

const getHistory = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Vui lòng đăng nhập!')
      router.push('/login')
      return
    }

    let username = 'Guest'
    try {
      const decoded = jwtDecode(token)
      username = decoded.subject || decoded.sub || decoded.username || 'Guest'
      console.log('Username từ token:', username)
    } catch (e) {
      console.warn('Token decode lỗi')
    }

    const res = await axios.post(
      `${API_BASE_URL}/customer/history`,
      { username },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    console.log('Raw data từ backend:', res.data)
    console.log('Số lượng hóa đơn:', res.data?.length || 0)

    // SỬA CHÍNH TẠI ĐÂY: ASSIGN TRỰC TIẾP – VUE SẼ UPDATE NGAY!
    history.value = res.data || []

    // Tự động chọn hóa đơn đầu tiên
    if (history.value.length > 0) {
      selectedInvoice.value = history.value[0]
    }

  } catch (err) {
    console.error('Lỗi lấy lịch sử:', err.response || err)
    history.value = []
  } finally {
    loading.value = false
  }
}

const selectInvoice = (item) => {
    selectedInvoice.value = item
}

const posterSrc = (poster) => poster ? `${IMAGE_URL}${poster}` : 'https://via.placeholder.com/80x80/eee/999?text=Combo'

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price || 0)

const formatDate = (date) => {
    if (!date) return 'Không rõ'
    return new Date(date).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatTime = (time) => time || 'Không rõ'

onMounted(() => {
  getHistory()
})
</script>

<style scoped>
.bg-gradient-success {
    background: linear-gradient(135deg, #28a745, #20c997) !important;
}

.cursor-pointer {
    cursor: pointer;
}

.list-group-item:hover {
    background-color: #f8f9fa !important;
}

@media (max-width: 991px) {
    .col-lg-7 {
        margin-top: 2rem;
    }
}
</style>