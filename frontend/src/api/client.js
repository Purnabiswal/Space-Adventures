import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("antariksh_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("antariksh_token");
      localStorage.removeItem("antariksh_user");
    }

    return Promise.reject(err);
  },
);

export default api;


// import axios from 'axios';

// const api = axios.create({
//   baseURL: '/api',
//   headers: { 'Content-Type': 'application/json' },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('antariksh_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response && err.response.status === 401) {
//       localStorage.removeItem('antariksh_token');
//       localStorage.removeItem('antariksh_user');
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;
