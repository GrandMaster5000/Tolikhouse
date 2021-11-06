import axios from 'axios';

const instante = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000/'
})

export default instante