import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4502',
  headers: {
    'Authorization': 'Basic ' + btoa('admin:admin'),
  }
});

export default api;