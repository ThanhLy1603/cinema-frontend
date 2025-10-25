import { jwtDecode } from "jwt-decode";

export function getUserNameFromToken(){
    const token = localStorage.getItem("token");

if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.username || decoded.name;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
// ✅ Hàm lấy role (không ảnh hưởng code cũ)
export function getUserRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (decoded.roles && decoded.roles.length > 0) {
      // ROLE_ADMIN → admin
      return decoded.roles[0].replace("ROLE_", "").toLowerCase();
    }
    return null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}