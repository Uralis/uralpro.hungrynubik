import { createContext, useState, useContext } from 'react';

const AuthContext = createContext({});

const LOCAL_STORAGE_KEY = 'auth';

export const AuthProvider = ({ children }) => {
  // Инициализация состояния из localStorage с проверкой валидности данных
  const [auth, setAuth] = useState(() => {
    try {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        // Проверяем наличие необходимых токенов
        if (parsedAuth?.accessToken && parsedAuth?.refreshToken) {
          return parsedAuth;
        }
      }
      return {};
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return {};
    }
  });

  // Обертка над setAuth для синхронизации с localStorage
  const updateAuth = (newAuth) => {
    try {
      // Если новый объект auth пустой, удаляем данные из localStorage
      if (Object.keys(newAuth).length === 0) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        // Проверяем наличие необходимых токенов перед сохранением
        if (newAuth?.accessToken && newAuth?.refreshToken) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAuth));
        } else {
          console.warn('Attempted to save invalid auth data:', newAuth);
          // Если данные невалидны, очищаем localStorage
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      // Обновляем состояние независимо от результата сохранения в localStorage
      setAuth(newAuth);
    } catch (error) {
      console.error('Error updating auth state:', error);
      // В случае ошибки очищаем всё
      setAuth({});
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста авторизации
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
