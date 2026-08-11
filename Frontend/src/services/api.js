import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // Required for cookies and secure sessions
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;