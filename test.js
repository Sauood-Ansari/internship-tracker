import http from 'k6/http';

export let options = {
  vus: 20,
  duration: '30s',
};

const BASE_URL = 'http://localhost:5000/api';

// 🔑 paste token here
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZDI5OGI5ZDAwMWMwOTVjMzg1M2FjMCIsImlhdCI6MTc3NTU0MDc5MywiZXhwIjoxNzc4MTMyNzkzfQ.-uKLXcQgAmZ33weiHnrVKOud5P2au2PUzPlLHKt-PQc';

const params = {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
};

export default function () {
  http.get(`${BASE_URL}/jobs`, params);
}