import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const login = () => {
  console.log("Thông tin đăng nhập:", form);
  router.push("/home");
};

export default {
  form,
  login,
};
