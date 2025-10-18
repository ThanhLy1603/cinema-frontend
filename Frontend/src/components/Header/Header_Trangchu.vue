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

        <nav :class="['menu', { active: menuOpen }]">
          <router-link to="/phim" @click="closeMenu">PHIM</router-link>
          <router-link to="/thuc-an-nuoc-uong" @click="closeMenu">THỨC ĂN & NƯỚC UỐNG</router-link>
          <router-link to="/uu-dai" @click="closeMenu">ƯU ĐÃI & KHUYẾN MÃI</router-link>
          <router-link to="/dich-vu" @click="closeMenu">DỊCH VỤ & TIỆN ÍCH</router-link>
          <router-link to="/gioi-thieu" @click="closeMenu">GIỚI THIỆU</router-link>
        </nav>

        <div class="right-group">
          <router-link to="/tai-khoan" class="login-btn" @click="closeMenu">ĐĂNG KÝ / ĐĂNG NHẬP</router-link>
          <div class="menu-toggle" @click="toggleMenu">
            {{ menuOpen ? "✕" : "☰" }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const closeMenu = () => (menuOpen.value = false)
</script>

<style src="../../assets/style/Header_Trangchu.css"></style>
