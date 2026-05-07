import axios from "axios";

const IS_SERVER = typeof window === "undefined";

const axiosClient = axios.create({
  baseURL: IS_SERVER
    ? process.env.NEXT_PRIVATE_API_URL
    : process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor xử lý dữ liệu trả về
axiosClient.interceptors.response.use(
  (response) => {
    const data = response.data;

    // NẾU backend trả về mảng trực tiếp [item1, item2]
    // THÌ tự động bọc lại thành { data: [item1, item2] } để đồng bộ
    if (Array.isArray(data)) {
      return { data: data };
    }

    return data; // Nếu đã là object { data: ... } hoặc format khác thì giữ nguyên
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosClient;
