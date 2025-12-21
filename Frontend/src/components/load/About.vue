<template>
    <div class="about-container">
        <h1 class="title">Về chúng tôi</h1>

        <img class="banner-image" src="https://www.bhdstar.vn/wp-content/uploads/2023/09/aboutus1.jpg" alt="Banner" />

        <p class="text">
            BHD Star Cineplex được biết đến với cụm rạp đầu tiên với 5 phòng chiếu vào năm
            2010. Từ 2014, BHD Star Cineplex là cụm rạp của doanh nghiệp Việt Nam duy nhất có
            sức phát triển mạnh mẽ, qua việc liên tục mở thêm các vị trí rạp mới, ở những khu
            vực đắc địa của Thành phố Hồ Chí Minh, Hà Nội, Huế và các tỉnh thành khác.
        </p>

        <p class="text">
            Bên cạnh việc sẽ tiếp tục mở rộng ra các tỉnh thành khác, giá trị cốt lõi của
            thương hiệu BHD Star Cineplex là luôn luôn bảo đảm trải nghiệm của khách hàng
            qua chất lượng phục vụ, đồng nhất tại tất cả các cụm rạp.
        </p>
    </div>

    <div class="about-container">

        <img class="banner-image" src="https://www.bhdstar.vn/wp-content/uploads/2023/09/aboutus4.jpg" alt="Banner" />

        <p><em>VietCine</em>&nbsp;Cineplex&nbsp;<em>Cinema</em>&nbsp;là hệ thống cụm rạp cao cấp với chất lượng âm thanh
            và
            hình ảnh hiện đại, được thành lập vào năm 2025.</p>
    </div>


    <div class="about-container">

        <img class="banner-image" src="https://www.bhdstar.vn/wp-content/uploads/2023/09/aboutus2.jpg" alt="Banner" />

        <p>BHD có tên đầy đủ là Công ty TNHH Bình Hạnh Đan, thành lập vào năm 1996. Công ty có hoạt động về Gameshow
            truyền
            hình và các hoạt động về phim như sản xuất phim, hợp tác đưa phim nước ngoài về Việt Nam và mở các rạp chiếu
            phim gọi tên là BHD Star Cineplex..</p>
        <p>BHD Star Cineplex là một trong những cụm rạp đầu tiên. Luôn đặt trải nghiệm khách hàng lên hàng đầu nên BHD
            Star Cineplex ngày càng thu hút được đông đảo khách hàng và tiến thân trở thành cụm rạp hàng đầu Việt Nam.
        </p>
    </div>

    <div class="about-container">

        <img class="banner-image" src="https://www.bhdstar.vn/wp-content/uploads/2023/09/aboutus3.jpg" alt="Banner" />

        <p>BHD Star Cineplex luôn được trang bị kỹ lưỡng về âm thanh hình ảnh luôn được áp dụng các công nghệ tối tân
            nhất mang lại trải nghiệm chân thật nhất, không gian thoải mái, sạch sẽ để khách hàng luôn yên tâm khi sử
            dụng dịch vụ và đội ngũ nhân viên được cam kết phục vụ đầy đủ, chuyên nghiệp thoả mãn các yêu cầu của khách
            hàng kịp thời.</p>

    </div>

</template>

<script setup></script>

<style scoped>
.about-container {
    width: 100%;
    text-align: center;
    padding: 20px 0;
}

/* Tiêu đề giữa trang */
.title {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 25px;
}

/* Hình banner */
.banner-image {
    width: 100%;
    /* chiếm toàn bộ chiều ngang container */
    height: 200px;
    /* chỉ hiển thị 1 phần chiều cao */
    object-fit: cover;
    /* giữ tỉ lệ, cắt phần thừa */
    object-position: center;
    /* lấy phần trung tâm của ảnh */
    margin-bottom: 20px;
}

/* Đoạn văn */
.text {
    max-width: 900px;
    /* giúp chữ không quá dài như trên hình */
    margin: 0 auto;
    font-size: 16px;
    line-height: 1.8;
    color: #333;
    text-align: center;
    margin-bottom: 15px;
}
</style>
