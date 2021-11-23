import axios from "axios";
import Cookies from "js-cookie";

const instante = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    Authorization: "Bearer" + " " + Cookies.get("token"),
  },
});

export default instante;
