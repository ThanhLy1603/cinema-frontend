<template>
  <header class="main-header">
    <div class="header-banner">
      <img src="/src/assets/header/banner_header.jpg" class="header-bg" alt="Header background" />
    </div>
    <div class="header-dash">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <img src="/src/assets/header/Logo.png" alt="VietCine Logo" />
          </router-link>
        </div>

        <!-- Menu chính -->
        <nav :class="['menu', { active: menuOpen }]">
          <button @click="emitChange('Movies')">PHIM</button>
          <button @click="emitChange('Products')">THỨC ĂN & NƯỚC UỐNG</button>
          <button @click="emitChange('Promotions')">ƯU ĐÃI & KHUYẾN MÃI</button>
          <button @click="emitChange('Services')">DỊCH VỤ & TIỆN ÍCH</button>
          <button @click="emitChange('About')">GIỚI THIỆU</button>
        </nav>

        <!-- Nhóm bên phải -->
        <div class="right-group">
          <!-- Nếu đã đăng nhập -->
          <div v-if="token" class="profile-dropdown" @click="toggleProfileMenu">
            <button class="login-btn">
              👤 HỒ SƠ
            </button>

            <!-- Dropdown xuất hiện khi click -->
            <div v-if="profileMenuOpen" class="dropdown-menu">
              <button @click="emitChange('accountProfile')">Trang cá nhân</button>
              <button @click="logout">Đăng xuất</button>
            </div>
          </div>

          <!-- Nếu chưa đăng nhập -->
          <button v-else class="login-btn" @click="router.push('/login')">
            ĐĂNG NHẬP
          </button>

          <div class="menu-toggle" @click="toggleMenu">
            {{ menuOpen ? "✕" : "☰" }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { inject } from 'vue';
  import { jwtDecode } from 'jwt-decode';

  const emit = defineEmits(['change-component']);
  const router = useRouter();
  const $swal = inject("$swal");

  const menuOpen = ref(false);
  const profileMenuOpen = ref(false); // 🟢 Trạng thái dropdown

  const token = localStorage.getItem('token') || null;

  function showToast(message) {
    const toastConfig = $swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500
    });

    toastConfig.fire({
      icon: 'success',
      title: message || "Vui lòng nhập thông báo"
    });
  }

  function toggleMenu() {
    menuOpen.value = !menuOpen.value;
  }

  function closeMenu() {
    menuOpen.value = false;
  }

  function emitChange(componentName) {
    emit('change-component', componentName);
    closeMenu();
  }

  function toggleProfileMenu() {
    profileMenuOpen.value = !profileMenuOpen.value;
  }

  // 👉 Khi chọn "Trang cá nhân"
  function goProfile() {
    const userInfo = jwtDecode(token);
    console.log("Thông tin user từ token:", userInfo);
    router.push(`/auth/${userInfo.subject}`);
    profileMenuOpen.value = false;
  }

  // 👉 Khi chọn "Đăng xuất"
  function logout() {
    localStorage.removeItem('token');

    profileMenuOpen.value = false
    router.push('/');
    showToast("Đăng xuất thành công");

    setTimeout(() => {
      window.location.reload(); // reload để đồng bộ header
    }, 500);

  }

  onMounted(() => {
    console.log("token: ", token);
    if (token) console.log("Thông tin trong token: ", jwtDecode(token));
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

    /* ✅ Cho phép menu xổ ra */
    position: relative;
    overflow: visible !important;
    z-index: 10;
  }

  .header-content {
    width: 95%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    overflow: visible !important;
    z-index: 10;

    /* ✅ Cho menu nằm trên */
    position: relative;
    overflow: visible !important;
    z-index: 20;
  }

  .logo img {
    height: 70px;
  }

  .menu {
    display: flex;
    gap: 25px;
  }

  .menu button{
    background: none;
    border: none;
    outline: none;
    font-size: 16px;
    font-weight: 700px;
    color: #222;
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.3px;
    position: relative;
  }

 .menu button:hover {
  background-color: lightgreen;
  color: black;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
}

  .menu a {
    color: #000;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.2s;
  }

  .menu a:hover {
    color: #007bff;
  }

  /* Nút đăng nhập */
  .login-btn {
    background-color: #94e900;
    color: #000;
    padding: 8px 15px;
    border-radius: 20px;
    font-weight: bold;
    text-decoration: none;
    transition: background 0.3s;
  }

  .login-btn:hover {
    background-color: #7ad000;
  }

  /* Nhóm login + ☰ */
  .right-group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Hamburger */
  .menu-toggle {
    display: none;
    cursor: pointer;
    font-size: 28px;
    color: #000;
    font-weight: bold;
    user-select: none;
    transition: transform 0.3s ease;
  }

  .menu-toggle:hover {
    transform: scale(1.1);
  }



  /* Tablet (<= 992px) */
  @media (max-width: 992px) {
    .logo img {
      height: 60px;
    }
    .login-btn {
      padding: 6px 12px;
    }
  }

  /* Mobile (<= 768px) */
  @media (max-width: 768px) {
    .header-banner {
      height: 100px;
    }

    .logo img {
      height: 45px;
    }

    /* Ẩn menu chính, dùng dạng dropdown */
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

      /* ✅ Đảm bảo nằm trên các phần khác */
      z-index: 9999 !important;
    }

    .menu a {
      padding: 10px 0;
      color: #000;
    }

    /* Khi bật menu */
    .menu.active {
      opacity: 1 !important;
      pointer-events: auto;
      transform: translateY(0);
    }

    /* Hiện hamburger cạnh login */
    .menu-toggle {
      display: block;
    }

    .header-content {
      position: relative;
    }

    .login-btn {
      font-size: 13px;
      padding: 6px 10px;
    }
  }

  /* Điện thoại nhỏ (<= 480px) */
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

    .header-dash {
      padding: 8px 0;
    }
  }
  /* Dropdown profile */
.profile-dropdown {
  position: relative;
  display: inline-block;
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
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
   }

   .dropdown-menu button:hover {
      background-color: #f0f0f0;
   }

/* Hiệu ứng xuất hiện */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}


</style>
