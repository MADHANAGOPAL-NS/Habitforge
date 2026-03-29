import axios from "axios";

const API = axios.create({
    baseURL : "https://habitforge-3rb4.onrender.com/api/auth",
});

export default API;
