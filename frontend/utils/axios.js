import axios from "axios";

const api = await axios.create({
  baseURL : import.meta.env.VITE_SERVER_URL,
  withCredentials : true,
})


export default api