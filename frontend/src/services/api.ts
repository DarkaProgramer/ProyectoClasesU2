import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// 1. Interceptor de PETICIÓN: Inyecta el Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Interceptor de RESPUESTA: Captura los memes y maneja errores
API.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasa la respuesta tal cual
  (error) => {
    // Extraemos el mensaje personalizado que configuramos en el Back
    // Si no viene uno, ponemos un mensaje de respaldo (fallback)
    const customMessage = error.response?.data?.message || 'Algo explotó atrás. "¡Houston, tenemos un problema!", llama al admin.';

    // Manejo de errores de sesión (401)
    if (error.response?.status === 401) {
      // Si el token ya no sirve o expiró, podemos limpiar el storage
      // localStorage.removeItem('token'); 
      console.error('Sesión inválida o expirada:', customMessage);
    }

    // Retornamos el error pero con el mensaje limpio para que el Front lo use fácil
    return Promise.reject({
      status: error.response?.status,
      message: customMessage,
      originalError: error
    });
  }
);

export default API;