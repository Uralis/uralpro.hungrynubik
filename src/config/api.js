export const API_BASE_URL = 'https://9db9-178-73-57-138.ngrok-free.app';

// Endpoints
export const ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/reg`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    
    // User endpoints
    USER_INFO: `${API_BASE_URL}/userInfo/user-info`
}; 