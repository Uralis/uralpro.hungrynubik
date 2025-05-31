import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { ENDPOINTS } from '../config/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();
    const mounted = useRef(true);

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current?.focus();
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (mounted.current) setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine if input is email or username
        const isEmail = EMAIL_REGEX.test(user);
        const payload = isEmail
            ? { email: user, password: pwd }
            : { username: user, password: pwd };

        try {
            const response = await axios.post(
                ENDPOINTS.LOGIN,
                JSON.stringify(payload),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            console.log('Login Response Data:', response?.data);
            console.log('Access Token:', response?.data?.accessToken);
            console.log('Refresh Token:', response?.data?.refreshToken);

            if (mounted.current) {
                const authData = {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                };
                setAuth(authData);
                setUser('');
                setPwd('');
                navigate(from, { replace: true });
            }
        } catch (err) {
            if (!mounted.current) return;

            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current?.focus();
        }
    };

    return (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                {errMsg}
            </p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username or Email:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />
                <button type="submit">Sign In</button>
            </form>
            <p>
                Need an Account?<br />
                <span className="line">
                    <Link to="/register">Sign Up</Link>
                </span>
            </p>
        </section>
    );
};

export default Login;
