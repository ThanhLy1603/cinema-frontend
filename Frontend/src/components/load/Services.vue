<template>
    <div class="container">
        <h1 class="title">Dịch vụ quảng cáo</h1>


        <!-- PRIVATE SHOW -->
        <section class="section">
            <div class="left">
                <h2 class="section-title">PRIVATE SHOW</h2>

            </div>

            <div class="right">
                <p class="subtitle">– Chiết khấu lớn với hợp đồng dài hạn.</p>
                <p>Vì bạn đặc biệt → người ấy đặc biệt → Suất chiếu riêng</p>

                <p>
                    Hãy để BHD Star Cineplex giúp bạn tổ chức những buổi tiệc hoặc sự kiện đặc biệt!
                    Bất kể xem phim thân mật hay họp mặt công ty, BHD Star là lựa chọn hợp lý.
                </p>

                <ul>
                    <li>Đặt trước bao phòng, chọn phòng – chọn giờ chiếu linh hoạt.</li>
                    <li>Chiếu clip kỷ niệm, trang trí phòng chiếu theo phong cách riêng.</li>
                    <li>Phòng chiếu riêng hoàn toàn – không ảnh hưởng người khác.</li>
                </ul>
            </div>
        </section>

        <div class="divider"></div>

        <!-- HALL RENTAL -->
        <section class="section reverse">
            <div class="left">
                <h2 class="section-title">Chi phí marketing hợp lý</h2>

                <p>Thuê phòng chiếu phù hợp cho họp công ty, hội thảo, ra mắt sản phẩm, sự kiện nội bộ.</p>

                <ul>
                    <li>Ra mắt sản phẩm với hình ảnh lớn trên màn hình cực nét.</li>
                    <li>Âm thanh rõ ràng – không gây khó chịu cho người khác.</li>
                    <li>Không gian riêng tư, sang trọng, chuyên nghiệp.</li>
                </ul>
            </div>

            <div class="right">
                <h2 class="section-title">HALL RENTAL</h2>
                <img src="https://bhdstar.vn/wp-content/uploads/2024/11/465292580_18467254468051823_6694145749527097481_n.jpg" alt="Hall Rental" />
            </div>
        </section>

        <!-- Description -->
        <p class="small-text">
            Phòng chiếu rộng rãi, màn hình lớn, âm thanh chuẩn rạp chiếu. Phù hợp tổ chức hội nghị,
            hội thảo hoặc sự kiện nội bộ. Có thể thuê trọn phòng hoặc mua vé số lượng lớn.
        </p>

        <ul class="footer-list">
            <li>Quảng cáo TVC, POSM, Booth…</li>
            <li>Thẻ quà tặng – phiếu quà tặng</li>
            <li>Thuê phòng chiếu làm sự kiện / xem phim riêng</li>
            <li>Vé xem phim số lượng lớn</li>
        </ul>

        <div class="contact">
            <p><strong>Liên hệ ngay:</strong></p>
            <p><strong>Địa chỉ:</strong></p>
            <p><strong>Điện thoại:</strong></p>
            <p><strong>Email:</strong></p>
        </div>
    </div>
</template>

<script setup>
// Không cần script — trang tĩnh
</script>

<style scoped>
.container {
    width: 80%;
    margin: auto;
    padding: 30px 0;
    font-family: Arial, sans-serif;
}

.title {
    text-align: center;
    font-size: 32px;
    margin-bottom: 5px;
}

.subtitle {
    text-align: center;
    color: #666;
}

.section {
    display: flex;
    gap: 30px;
    margin: 40px 0;
    align-items: flex-start;
}

.section.reverse {
    flex-direction: row-reverse;
}

.section-title {
    font-size: 22px;
    margin-bottom: 12px;
    font-weight: bold;
}

.left,
.right {
    flex: 1;
}

img {
    width: 100%;
    border-radius: 8px;
}

.divider {
    height: 1px;
    background: #ddd;
    margin: 40px 0;
}

.small-text {
    font-size: 14px;
    color: #444;
    line-height: 1.6;
}

.footer-list {
    margin-top: 15px;
    line-height: 1.8;
    padding-left: 18px;
}

.contact {
    margin-top: 40px;
    background: #f8f8f8;
    padding: 20px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.6;
}
</style>
