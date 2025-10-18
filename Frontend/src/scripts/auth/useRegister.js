import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  ho: "",
  ten: "",
  gioitinh: "",
  email: "",
  password: "",
  repassword: "",
  phone: "",
  ngay: "",
  thang: "",
  nam: "",
  city: "",
  agree: false,
  promo: false,
});

const years = computed(() => {
  const current = new Date().getFullYear();
  return Array.from({ length: 100 }, (_, i) => current - i);
});

const submitForm = () => {
  router.push("/dang-nhap");
};

export default {
  form,
  years,
  submitForm,
};
