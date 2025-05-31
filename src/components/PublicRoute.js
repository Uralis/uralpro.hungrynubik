import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PublicRoute = () => {
    const { auth } = useAuth();

    return (
        // Если пользователь авторизован, перенаправляем на домашнюю страницу
        auth?.accessToken
            ? <Navigate to="/" replace />
            : <Outlet />
    );
}

export default PublicRoute; 