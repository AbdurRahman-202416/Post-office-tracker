import axios from 'axios';

const httpRequest = axios.create({
  baseURL: 'https://api.zippopotam.us/bd/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default httpRequest;