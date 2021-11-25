import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

console.log(cookies);
const instante = axios.create({
  baseURL: "http://localhost:3001",
});

instante.defaults.headers.common['Authorization'] = `Bearer ${cookies?.token}`;
export default instante;
