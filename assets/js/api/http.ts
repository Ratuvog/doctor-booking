import CONFIG from '../config';
import axios from 'axios';

const http = axios.create({
  baseURL: CONFIG.backend,
  headers: {},
});

export default http;
