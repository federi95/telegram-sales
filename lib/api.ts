import axios from "axios";

const instance = axios.create({
  baseURL: process.env.BASE_URL,
});

instance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { instance as axios };
