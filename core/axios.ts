import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

console.log(cookies);
const instance = axios.create({
  baseURL: "http://localhost:3001",
});

instance.defaults.headers.common['Authorization'] = `Bearer ${cookies?.token}`;
export default instance;
