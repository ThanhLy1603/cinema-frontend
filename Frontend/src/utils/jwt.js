// import jwtDecode from "jwt-decode";

// export function getUserNameFromToken(){
//     const token = localStorage.getItem("token");

// if (!token) return null;
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.sub || decoded.username || decoded.name;
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return null;
//   }
// }