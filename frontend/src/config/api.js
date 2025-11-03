// API yapılandırması
// Environment variable'dan API URL'ini al, yoksa varsayılan değeri kullan
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mil-print-convergence-circulation.trycloudflare.com';

// API helper fonksiyonları
export const api = {
  baseURL: API_BASE_URL,
  
  // Tam URL oluştur
  url: (endpoint) => {
    // Eğer endpoint zaten tam URL ise, direkt dön
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    // Base URL'den sonra / varsa kaldır
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    // Endpoint'in başında / yoksa ekle
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }
};

export default api;
