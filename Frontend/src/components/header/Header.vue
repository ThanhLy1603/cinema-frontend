<template>
   <div class="container-fluid">
      <header class="main-header">
         <!-- Banner -->
         <div class="header-banner">
            <img
               src="/src/assets/header/banner_header.jpg"
               class="header-bg"
               alt="Header background"
            />
         </div>

         <!-- Thanh điều hướng -->
         <div class="header-dash">
            <div class="header-content">
               <!-- Logo -->
               <div class="logo">
                  <router-link to="/">
                     <img src="/src/assets/header/Logo.png" alt="VietCine Logo" />
                  </router-link>
               </div>

               <!-- Menu chính -->
               <nav :class="['menu', { active: menuOpen }]">
                  <button @click="emitChange('Films')">PHIM</button>
                  <button @click="emitChange('Products')">THỨC ĂN & NƯỚC UỐNG</button>
                  <button @click="emitChange('Promotions')">ƯU ĐÃI & KHUYẾN MÃI</button>
                  <button @click="emitChange('Services')">DỊCH VỤ & TIỆN ÍCH</button>
                  <button @click="emitChange('About')">GIỚI THIỆU</button>
               </nav>

               <!-- Nhóm bên phải -->
               <div class="right-group">
                  <!-- Hồ sơ -->
                  <div v-if="token" class="profile-dropdown" @click="toggleProfileMenu">
                     <button class="login-btn">👤 HỒ SƠ</button>

                     <div v-if="profileMenuOpen" class="dropdown-menu">
                        <button @click="emitChange('AccountProfile')">Trang cá nhân</button>
                        <button @click="logout">Đăng xuất</button>
                     </div>
                  </div>

                  <!-- Đăng nhập -->
                  <button v-else class="login-btn" @click="router.push('/login')">ĐĂNG NHẬP</button>

                  <!-- Menu mobile -->
                  <div class="menu-toggle" @click="toggleMenu">
                     {{ menuOpen ? '✕' : '☰' }}
                  </div>
               </div>
            </div>
         </div>
      </header>
   </div>
</template>

<script setup>
   import { ref, onMounted } from 'vue';
   import { useRouter } from 'vue-router';
   import { inject } from 'vue';
   import { jwtDecode } from 'jwt-decode';

   const emit = defineEmits(['change-component']);
   const router = useRouter();
   const $swal = inject('$swal');

   const menuOpen = ref(false);
   const profileMenuOpen = ref(false);
   const token = localStorage.getItem('token') || null;

   // Hiển thị toast thông báo
   function showToast(message) {
      const toast = $swal.mixin({
         toast: true,
         position: 'top-end',
         showConfirmButton: false,
         timerProgressBar: true,
         timer: 1500,
      });
      toast.fire({ icon: 'success', title: message });
   }

   // Toggle menu
   function toggleMenu() {
      menuOpen.value = !menuOpen.value;
   }
   function closeMenu() {
      menuOpen.value = false;
   }

   // ✅ Khi click menu ở FilmDetail → quay lại Home và mở đúng tab
   function emitChange(componentName) {

      emit('change-component', componentName);
      closeMenu();

      const isHome = router.currentRoute.value.path === '/';

      if (isHome) {
         // Đang ở Home → push để lưu history
         router.push({ query: { tab: componentName } });
      } else {
         // Không ở Home → chuyển về Home + push
         router.push({ path: '/', query: { tab: componentName } });
      }
   }

   // Toggle menu hồ sơ
   function toggleProfileMenu() {
      profileMenuOpen.value = !profileMenuOpen.value;
   }

   // 👉 Đi tới trang cá nhân
   function goProfile() {
      const userInfo = jwtDecode(token);
      router.push(`/auth/${userInfo.subject}`);
      profileMenuOpen.value = false;
   }

   // 👉 Đăng xuất
   function logout() {
      localStorage.removeItem('token');
      profileMenuOpen.value = false;
      router.push('/');
      showToast('Đăng xuất thành công');
      setTimeout(() => window.location.reload(), 500);
   }

   // Debug log
   onMounted(() => {
      if (token) console.log('Thông tin token:', jwtDecode(token));
   });
</script>

<style scoped>
   .main-header {
      width: 100%;
      overflow: visible !important;
   }

   /* === Banner === */
   .header-banner {
      position: relative;
      width: 100%;
      height: 150px;
      background: linear-gradient(to right, #7cc9ff, #54a3ff);
   }
   .header-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
   }

   /* === Dash bar === */
   .header-dash {
      background-color: white;
      border-top: 2px solid #ccc;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      padding: 10px 0;
      position: relative;
      z-index: 10;
   }
   .header-content {
      width: 95%;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 20;
   }
   .logo img {
      height: 70px;
   }

   /* === Menu === */
   .menu {
      display: flex;
      gap: 25px;
   }
   .menu button {
      background: none;
      border: none;
      font-size: 16px;
      font-weight: 600;
      color: #222;
      cursor: pointer;
      padding: 5px 10px;
      border-radius: 8px;
      transition: all 0.25s ease;
   }
   .menu button:hover {
      background-color: lightgreen;
      color: black;
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
   }

   /* === Đăng nhập & Hồ sơ === */
   .login-btn {
      background-color: #94e900;
      color: #000;
      padding: 8px 15px;
      border-radius: 20px;
      font-weight: bold;
      transition: background 0.3s;
   }
   .login-btn:hover {
      background-color: #7ad000;
   }

   /* === Hồ sơ dropdown === */
   .profile-dropdown {
      position: relative;
   }
   .dropdown-menu {
      position: absolute;
      top: 45px;
      right: 0;
      background: white;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      min-width: 150px;
      z-index: 1000;
      animation: fadeIn 0.2s ease-in-out;
   }
   .dropdown-menu button {
      background: none;
      border: none;
      padding: 10px 15px;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s;
   }
   .dropdown-menu button:hover {
      background-color: #f0f0f0;
   }

   /* === Menu di động === */
   .menu-toggle {
      display: none;
      cursor: pointer;
      font-size: 28px;
      font-weight: bold;
      user-select: none;
      transition: transform 0.3s ease;
   }
   .menu-toggle:hover {
      transform: scale(1.1);
   }

   /* Responsive */
   @media (max-width: 992px) {
      .logo img {
         height: 60px;
      }
      .login-btn {
         padding: 6px 12px;
      }
   }
   @media (max-width: 768px) {
      .header-banner {
         height: 100px;
      }
      .logo img {
         height: 45px;
      }
      .menu {
         position: absolute;
         top: 60px;
         right: 10px;
         flex-direction: column;
         gap: 0;
         width: 200px;
         background: white;
         border-radius: 10px;
         box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
         padding: 10px 0;
         opacity: 0;
         pointer-events: none;
         transform: translateY(-10px);
         transition: all 0.3s ease;
         z-index: 9999;
      }
      .menu.active {
         opacity: 1 !important;
         pointer-events: auto;
         transform: translateY(0);
      }
      .menu-toggle {
         display: block;
      }
   }
   @media (max-width: 480px) {
      .header-banner {
         height: 80px;
      }
      .logo img {
         height: 40px;
      }
      .login-btn {
         padding: 5px 8px;
         font-size: 12px;
      }
   }

   /* Animation */
   @keyframes fadeIn {
      from {
         opacity: 0;
         transform: translateY(-5px);
      }
      to {
         opacity: 1;
         transform: translateY(0);
      }
   }
</style>
