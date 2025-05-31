import axios from '../api/axios';
import useAuth from './useAuth';
import { ENDPOINTS } from '../config/api';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.post(ENDPOINTS.REFRESH_TOKEN,
                JSON.stringify({ refreshToken: auth?.refreshToken }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            // Создаем новый объект auth с обновленными токенами
            const newAuthData = {
                ...auth,
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken // Сохраняем новый refresh token, если он пришел
            };

            // Обновляем состояние и localStorage
            setAuth(newAuthData);

            // Возвращаем новый access token для использования в interceptor
            return response.data.accessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            // Если refresh token недействителен, очищаем авторизацию
            setAuth({});
            // Очищаем localStorage
            localStorage.removeItem('auth');
            throw error;
        }
    };

    return refresh;
};

export default useRefreshToken;
