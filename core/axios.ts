import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

const instante = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: "Bearer" + " " + cookies?.token,
  },
});

export default instante;
