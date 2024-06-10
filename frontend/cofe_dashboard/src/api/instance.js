import axios from "axios";

const prodUrl = "https://cce9-84-54-153-136.ngrok-free.app";


const instance = axios.create({
  baseURL: prodUrl,
  headers: {
    "ngrok-skip-browser-warning": "1",
    "Content-Type": "application/json",
  },
});

export default instance;
