import { useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ENDPOINTS } from '../config/api';

const Home = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUserInfo = async () => {
            try {
                const response = await axiosPrivate.get(ENDPOINTS.USER_INFO, {
                    signal: controller.signal,
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                
                if (isMounted) {
                    console.log('User Info:', response.data);
                    setUserInfo(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error fetching user info:', err);
                    setError('Failed to load user information');
                    if (err?.response?.status === 401) {
                        setAuth({});
                        navigate('/login');
                    }
                }
            }
        };

        if (auth?.accessToken) {
            getUserInfo();
        } else {
            navigate('/login');
        }

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth, navigate, setAuth, axiosPrivate]);

    const logout = async () => {
        console.log('Tokens before logout:');
        console.log('Access Token:', auth?.accessToken);
        console.log('Refresh Token:', auth?.refreshToken);
        setAuth({});
        console.log('Tokens after logout: ', null);
        navigate('/linkpage');
    }

    return (
        <section>
            <h1>Home</h1>
            <br />
            {error ? (
                <p className="error">{error}</p>
            ) : userInfo ? (
                <div>
                    <p>Username: {userInfo?.username || 'N/A'}</p>
                    <p>Country: {userInfo?.country || 'N/A'}</p>
                    <p>ID: {userInfo?.id || 'N/A'}</p>
                    <p>Novel Progress: {userInfo?.novelProgress?.length || 0}</p>
                    <p>Novel Favorites: {userInfo?.novelFavorites?.length || 0}</p>
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
            <br />
            <Link to="/linkpage">Go to the link page</Link>
            <div className="flexGrow">
                <button onClick={logout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home
