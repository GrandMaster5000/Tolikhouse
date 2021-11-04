import axios from 'axios';

const instante = axios.create({
    baseURL: 'https://jsonpalceholder.typicode.com/',
    withCredentials: true
})

export default instante