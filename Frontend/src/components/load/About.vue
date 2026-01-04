<template>
  <div class="about-page py-5">
    <!-- Hero Section -->
    <section class="hero-section position-relative overflow-hidden mb-5">
      <div class="hero-bg"></div>
      <div class="container position-relative z-2">
        <div class="text-center py-5 py-md-7">
          <h1 class="display-4 fw-bold mb-4 reveal">
            Về <span class="text-success">VietCine</span> Cineplex
          </h1>
          <p class="lead fs-3 reveal delay-1">
            Hệ thống rạp chiếu phim cao cấp hiện đại – Thành lập năm 2025
          </p>
        </div>
      </div>
    </section>

    <!-- Giới thiệu ngắn -->
    <section class="container mb-6">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center reveal">
          <p class="fs-4 lh-lg opacity-90">
            <em>VietCine</em> Cineplex là hệ thống rạp chiếu phim cao cấp với công nghệ âm thanh và hình ảnh tiên tiến nhất,
            mang đến trải nghiệm điện ảnh đỉnh cao. Chúng tôi cam kết mang lại không gian giải trí sang trọng, thoải mái
            và dịch vụ chuyên nghiệp hàng đầu tại Việt Nam.
          </p>
        </div>
      </div>
    </section>

    <!-- Các section xen kẽ -->
    <section class="bg-black py-5">
      <div class="container">
        <!-- Phòng chiếu đẳng cấp -->
        <div class="row align-items-center g-5 mb-6 reveal">
          <div class="col-lg-6">
            <img :src="images.theater1" alt="Phòng chiếu hiện đại" class="img-fluid rounded-4 shadow-lg" />
          </div>
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 text-success">Phòng chiếu đẳng cấp quốc tế</h2>
            <p class="fs-5 lh-lg opacity-90">
              Trang bị ghế ngồi thoải mái, màn hình lớn sắc nét, hệ thống âm thanh Dolby Atmos sống động,
              mang đến cảm giác chân thực như đang hòa mình vào bộ phim.
            </p>
          </div>
        </div>

        <!-- Sảnh chờ & Khu ẩm thực -->
        <div class="row align-items-center g-5 mb-6 flex-lg-row-reverse reveal">
          <div class="col-lg-6">
            <img :src="images.lobby" alt="Sảnh chờ sang trọng" class="img-fluid rounded-4 shadow-lg" />
          </div>
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 text-success">Sảnh chờ & Khu vực ẩm thực hiện đại</h2>
            <p class="fs-5 lh-lg opacity-90">
              Không gian lobby rộng rãi, thiết kế hiện đại với quầy popcorn và nước uống đa dạng.
              Đội ngũ nhân viên thân thiện, luôn sẵn sàng hỗ trợ bạn.
            </p>
          </div>
        </div>

        <!-- Phòng VIP -->
        <div class="row align-items-center g-5 mb-6 reveal">
          <div class="col-lg-6">
            <img :src="images.vip" alt="Ghế VIP cao cấp" class="img-fluid rounded-4 shadow-lg" />
          </div>
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 text-success">Phòng VIP & Ghế ngả lưng sang trọng</h2>
            <p class="fs-5 lh-lg opacity-90">
              Trải nghiệm hạng thương gia với ghế recliner bọc da cao cấp, không gian riêng tư,
              dịch vụ gọi món tại chỗ – lý tưởng cho buổi hẹn hò hoặc gia đình.
            </p>
          </div>
        </div>

        <!-- Công nghệ tiên tiến -->
        <div class="row align-items-center g-5 mb-6 flex-lg-row-reverse reveal">
          <div class="col-lg-6">
            <img :src="images.projector" alt="Công nghệ chiếu phim" class="img-fluid rounded-4 shadow-lg" />
          </div>
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 text-success">Công nghệ chiếu phim tiên tiến nhất</h2>
            <p class="fs-5 lh-lg opacity-90">
              Sử dụng máy chiếu laser 4K, hệ thống âm thanh vòm đa kênh, đảm bảo hình ảnh sắc nét
              và âm thanh sống động vượt trội.
            </p>
          </div>
        </div>

        <!-- Trải nghiệm khách hàng -->
        <div class="row align-items-center g-5 mb-6 reveal">
          <div class="col-lg-6">
            <img :src="images.audience" alt="Khán giả hạnh phúc" class="img-fluid rounded-4 shadow-lg" />
          </div>
          <div class="col-lg-6">
            <h2 class="display-5 fw-bold mb-4 text-success">Trải nghiệm khách hàng là ưu tiên hàng đầu</h2>
            <p class="fs-5 lh-lg opacity-90">
              Chúng tôi luôn lắng nghe và cải thiện để mang đến những khoảnh khắc giải trí đáng nhớ.
              Hãy đến với VietCine – Nơi điện ảnh trở nên sống động!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA cuối trang (không dùng clip-path phức tạp) -->
    <section class="cta-section py-6 text-center">
      <div class="container">
        <h2 class="display-5 fw-bold mb-4 reveal">Sẵn sàng cho trải nghiệm điện ảnh đỉnh cao?</h2>
        <router-link to="/" class="btn btn-success btn-lg px-5 py-4 rounded-pill shadow-lg fw-bold reveal delay-1">
          Đặt vé ngay hôm nay
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

const images = reactive({
  theater1: 'https://www.cineak.com/wordpress/wp-content/uploads/2021/04/Proj-Gal-150.jpg',
  lobby: 'https://www.shutterstock.com/image-photo/modern-movie-theater-lobby-ticket-260nw-2636982775.jpg',
  vip: 'https://www.theaterseatstore.com/media/catalog/product/cache/642ff8ea9b3baed9a3d76bd3cb909207/v/i/vip-continental-3.jpg',
  projector: 'https://assets.newatlas.com/dims4/default/e92a184/2147483647/strip/true/crop/1500x844+0+0/resize/1500x844!/format/webp/quality/90/?url=https%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F39%2F5b%2F2cd459154a3c81a81a295de60538%2F83025e92-c6d5-4094-a416-3be0f2a03e15.jpg',
  audience: 'https://media.gettyimages.com/id/1146819008/photo/happy-audience-watching-movie-in-cinema-hall.jpg?s=1024x1024&w=gi&k=20&c=9wGD7L4noDT2gQ-LpkH6CLmgCG2uaSAuYogD2-cl_Wk='
})

onMounted(() => {
  const reveals = document.querySelectorAll('.reveal')

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active')
      }
    })
  }, { threshold: 0.1 })

  reveals.forEach(el => observer.observe(el))
})
</script>

<style scoped>
.about-page {
  background-color: #000;
  color: #fff;
}

.hero-section {
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75));
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: url('https://thumbs.dreamstime.com/b/luxury-outdoor-movie-night-city-view-sunset-as-twilight-paints-urban-sky-cozy-luxurious-cinema-set-up-415363265.jpg') center/cover no-repeat;
  transform: scale(1.1);
  transition: transform 12s ease;
}

.hero-section:hover .hero-bg {
  transform: scale(1);
}

.text-success {
  color: #20c997 !important;
}

.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: all 1s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.reveal.delay-1 {
  transition-delay: 0.3s;
}

.img-fluid {
  transition: transform 0.6s ease;
}

.img-fluid:hover {
  transform: scale(1.05);
}

.cta-section {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.btn-success {
  background: linear-gradient(135deg, #28a745, #20c997);
  border: none;
  transition: all 0.4s ease;
}

.btn-success:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px rgba(40, 167, 69, 0.5);
}

/* Utility classes cho margin bottom */
.mb-6 { margin-bottom: 4rem; }
.py-7 { padding-top: 6rem; padding-bottom: 6rem; }
@media (max-width: 768px) {
  .py-7 { padding-top: 4rem; padding-bottom: 4rem; }
}
</style>