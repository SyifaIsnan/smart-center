// src/api/zakiApi.js
import axios from 'axios';

// Konfigurasi Client khusus Zaki
const zakiClient = axios.create({
  baseURL: 'http://41.216.191.42:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 1. GET /monitoring/ 
  Ini endpoint "Sapu Jagat". Mengembalikan data System, CPU, Memory, Disk, dan Docker sekaligus.
*/
export const getZakiDashboardData = async () => {
  try {
    const response = await zakiClient.get('/monitoring/');
    // Perhatikan: Axios menaruh body di .data, dan API kamu membungkus hasilnya di properti "data" lagi.
    return response.data.data; 
  } catch (error) {
    console.error("Gagal mengambil data monitoring utama Zaki:", error);
    throw error;
  }
};

/* 2. GET /monitoring/health 
  Endpoint ini unik karena tidak dibungkus properti "data".
*/
export const getZakiHealth = async () => {
  try {
    const response = await zakiClient.get('/monitoring/health');
    return response.data; // Langsung kembalikan, tidak perlu .data.data
  } catch (error) {
    console.error("Gagal mengambil status health Zaki:", error);
    throw error;
  }
};

/* 3. GET /monitoring/network 
*/
export const getZakiNetwork = async () => {
  try {
    const response = await zakiClient.get('/monitoring/network');
    return response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data network Zaki:", error);
    throw error;
  }
};

/* 4. GET /monitoring/processes 
*/
export const getZakiProcesses = async () => {
  try {
    const response = await zakiClient.get('/monitoring/processes');
    return response.data.data; // Ini berupa Array
  } catch (error) {
    console.error("Gagal mengambil daftar proses Zaki:", error);
    throw error;
  }
};

/* 5. GET /monitoring/history 
  Bisa digunakan untuk menggambar grafik Sparkline Memory
*/
export const getZakiHistory = async () => {
  try {
    const response = await zakiClient.get('/monitoring/history');
    return response.data.data; // Ini berupa Array of objects
  } catch (error) {
    console.error("Gagal mengambil history Zaki:", error);
    throw error;
  }
};

/*
  Catatan: 
  Endpoint seperti /monitoring/cpu, /monitoring/memory, dll tidak wajib dibuatkan fungsi terpisah
  KARENA datanya sudah termasuk di dalam getZakiDashboardData() (yaitu endpoint /monitoring/).
  Ini akan menghemat beban server karena cukup 1x request untuk banyak panel.
*/