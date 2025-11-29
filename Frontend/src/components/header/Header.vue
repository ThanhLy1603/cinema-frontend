<template>
   <div class="container-fluid fixed-top">
      <header class="main-header" :class="{ scrolled: isScrolled }">
         <!-- Banner -->
         <div class="header-banner" :class="{ hidden: isScrolled }">
            <img
               src="/src/assets/header/banner_header.jpg"
               class="header-bg"
               alt="Header background"
            />

            <div class="banner-overlay"></div>
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
                        <button v-if="isAdmin" @click="goAdmin">Trang quản trị</button>
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
   import { ref, onMounted, onBeforeMount } from 'vue';
   import { useRouter } from 'vue-router';
   import { inject } from 'vue';
   import { jwtDecode } from 'jwt-decode';

   const emit = defineEmits(['change-component']);
   const router = useRouter();
   const $swal = inject('$swal');
   const isAdmin = ref(false);
   const isScrolled = ref(false);

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

   // Đi tới trang quản trị
   function goAdmin() {
      router.push('/admin');
      profileMenuOpen.value = false;
   }

   function handleScroll() {
      const scrolled = window.scrollY > 100;
      isScrolled.value = scrolled;
      document.body.classList.toggle('header-scrolled', scrolled);
   }

   // Debug log
   onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      if (token) {
         const decoded = jwtDecode(token);
         console.log('Thông tin token:', decoded);
         isAdmin.value = decoded.roles?.includes('ROLE_ADMIN');
      }
   });

   onBeforeMount(() => {
      window.removeEventListener('scroll', handleScroll);
   });
</script>

<style scoped>
   /* ==================== HEADER CHUNG ==================== */
   .main-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
   }

   /* === Banner === */

   .header-banner {
      height: 150px;
      overflow: hidden;
      position: relative;
      transition:
         height 0.5s ease,
         opacity 0.5s ease;
   }

   .header-banner.hidden {
      height: 0;
      opacity: 0;
   }

   .header-bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
   }

   .main-header.scrolled .header-bg {
      transform: scale(1.1);
   }

   .banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent 50%);
   }

   /* ==================== THANH ĐIỀU HƯỚNG (luôn cố định) ==================== */
   .header-dash {
      background-color: white;
      border-top: 2px solid #ccc;
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
      padding: 10px 0;
      position: relative;
      z-index: 10;
   }

   .main-header.scrolled .header-dash {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
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

   .main-header.scrolled .logo img {
      height: 58px;
   }

   /* ==================== MENU CHÍNH ==================== */
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

   /* ==================== NÚT ĐĂNG NHẬP / HỒ SƠ ==================== */
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

   .profileMenuOpen + .dropdown-menu,
   .dropdown-menu[style*='block'] {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
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
   .right-group {
      display: flex;
      align-items: center;
      gap: 15px;
      position: relative;
   }

   /* ==================== MENU MOBILE ==================== */
   .menu-toggle {
      display: none;
      cursor: pointer;
      font-size: 28px;
      font-weight: bold;
      user-select: none;
      transition: transform 0.3s ease;
      line-height: 1;
   }
   .menu-toggle:hover {
      transform: scale(1.1);
   }

   /* ==================== RESPONSIVE ==================== */
   @media (max-width: 992px) {
      .menu {
         gap: 20px;
      }
      .menu button {
         font-size: 15px;
         padding: 8px 12px;
      }
   }
   @media (max-width: 768px) {
      .header-banner {
         height: 100px;
      }
      .header-dash {
         padding: 10px 0;
      }

      .menu {
         position: fixed;
         top: 80px;
         right: 20px;
         background: white;
         flex-direction: column;
         width: 220px;
         border-radius: 18px;
         box-shadow: 0 15px 40px rgba(0, 0, 0, 0.22);
         padding: 16px 0;
         opacity: 0;
         pointer-events: none;
         transform: translateY(-20px);
         transition: all 0.4s ease;
         z-index: 9999;
      }

      .menu.active {
         opacity: 1;
         pointer-events: auto;
         transform: translateY(0);
      }

      .menu button {
         width: 100%;
         text-align: left;
         padding: 14px 28px;
         border-radius: 0;
      }

      .menu-toggle {
         display: block;
      }

      .main-header.scrolled .logo img {
         height: 52px;
      }
   }
   @media (max-width: 480px) {
      .header-banner {
         height: 80px;
      }
      .logo img {
         height: 48px;
      }
      .main-header.scrolled .logo img {
         height: 46px;
      }
      .login-btn {
         padding: 8px 14px;
         font-size: 13px;
      }
   }
</style>
