<script setup>
   import { ref, reactive, onMounted } from 'vue';
   import axios from 'axios';

   const API_BASE_URL = 'http://localhost:8080/api/auth/films';
   const API_CAT_URL = 'http://localhost:8080/api/auth/films/categories';

   // UI State
   const showForm = ref(false);
   const films = ref([]);
   const categories = ref([]);
   const loading = ref(false);
   const editingId = ref(null);

   // Form data
   const filmForm = reactive({
      title: '',
      country: '',
      director: '',
      releaseDate: '',
      actors: '',
      description: '',
      duration: '',
      status: 'coming',
      categories: [],
      poster: null,
      trailer: null,
   });

   // --- ✅ Validation ---
   const validateForm = () => {
      if (!filmForm.title) return 'Tên phim không được để trống';
      if (!filmForm.country) return 'Quốc gia không được để trống';
      if (!filmForm.director) return 'Đạo diễn không được để trống';
      if (!filmForm.releaseDate) return 'Ngày phát hành không được để trống';
      if (!filmForm.duration || filmForm.duration <= 0) return 'Thời lượng không hợp lệ';
      if (filmForm.categories.length === 0) return 'Hãy chọn ít nhất 1 thể loại';
      return null;
   };

   function getCategoryNames(film) {
   return film?.categories?.length
      ? film.categories.map(c => c?.name ?? 'Không tên').join(', ')
      : 'Đang cập nhật...';
   }


   // --- ✅ Load films ---
   const loadFilms = async () => {
      loading.value = true;
      const res = await axios.get(API_BASE_URL);
      films.value = res.data;
      loading.value = false;
   };

   // --- ✅ Load categories ---
   const loadCategories = async () => {
      const res = await axios.get(API_CAT_URL);
      categories.value = res.data;
   };

   // --- ✅ Handle file upload ---
   const handlePoster = (e) => (filmForm.poster = e.target.files[0]);
   const handleTrailer = (e) => (filmForm.trailer = e.target.files[0]);

   // --- ✅ Create / Update film ---
   const saveFilm = async () => {
      const error = validateForm();
      if (error) return alert(error);

      const formData = new FormData();
      for (const key in filmForm) {
         if (key !== 'categories') formData.append(key, filmForm[key]);
      }
      filmForm.categories.forEach((c) => formData.append('categories', c));

      try {
         if (editingId.value) {
            await axios.put(`${API_BASE_URL}/${editingId.value}`, formData);
            alert('✅ Cập nhật phim thành công');
         } else {
            await axios.post(API_BASE_URL, formData);
            alert('✅ Thêm phim thành công');
         }

         resetForm();
         loadFilms();
         showForm.value = false;
      } catch (e) {
         alert('❌ Lỗi khi lưu phim');
      }
   };

   // --- ✅ Edit film ---
   const editFilm = (film) => {
      showForm.value = true;
      editingId.value = film.id;
      Object.assign(filmForm, film, { poster: null, trailer: null });
   };

   // --- ✅ Delete film ---
   const deleteFilm = async (id) => {
      if (!confirm('Bạn có chắc muốn xoá phim này?')) return;
      await axios.delete(`${API_BASE_URL}/${id}`);
      alert('🗑️ Xoá phim thành công');
      loadFilms();
   };

   // --- ✅ Reset form ---
   const resetForm = () => {
      Object.assign(filmForm, {
         title: '',
         country: '',
         director: '',
         releaseDate: '',
         actors: '',
         description: '',
         duration: '',
         status: 'coming',
         categories: [],
         poster: null,
         trailer: null,
      });
      editingId.value = null;
   };

   // --- ✅ Init ---
   onMounted(() => {
      loadFilms();
      loadCategories();
   });
</script>
