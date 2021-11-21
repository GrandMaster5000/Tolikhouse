import axios from "axios";

const instante = axios.create({
  baseURL: "http://localhost:3001",
});

export default instante;
