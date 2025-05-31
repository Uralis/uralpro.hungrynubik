import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle, faUser, faEnvelope, faLock, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { ENDPOINTS } from '../config/api';
import './Register.css';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [country, setCountry] = useState(1);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd, email, country]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Final validation
        if (!USER_REGEX.test(user) || !PWD_REGEX.test(pwd) || !EMAIL_REGEX.test(email) || !(pwd === matchPwd)) {
            setErrMsg("Invalid Entry");
            return;
        }
        const newUser = {
            Id: uuidv4(),
            Username: user,
            Password: pwd,
            Email: email,
            Country: country
        };
        try {
            const response = await axios.post(ENDPOINTS.REGISTER,
                JSON.stringify(newUser),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
            // reset
            setUser('');
            setPwd('');
            setMatchPwd('');
            setEmail('');
            setCountry(1);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed');
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            {success ? (
                <div className="form-container register-form">
                    <div className="register-success">
                        <FontAwesomeIcon icon={faCheck} />
                        <h1 className="form-title">Registration Successful</h1>
                        <p className="form-helper">
                            Your account has been created successfully.
                        </p>
                        <Link to="/" className="form-link">Proceed to Sign In</Link>
                    </div>
                </div>
            ) : (
                <div className="form-container register-form">
                    {errMsg && (
                        <div className="errmsg" role="alert">
                            <FontAwesomeIcon icon={faTimes} />
                            {errMsg}
                        </div>
                    )}
                    
                    <h1 className="form-title">Create Account</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                <FontAwesomeIcon icon={faUser} className="field-icon" />
                                Username
                            </label>
                            <input
                                className={`form-input ${user && !validName ? 'input-error' : ''}`}
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                                placeholder="Enter username"
                            />
                            {user && (
                                <div className={`status-indicator ${validName ? 'valid' : 'invalid'}`}>
                                    <FontAwesomeIcon icon={validName ? faCheck : faTimes} />
                                    {validName ? 'Valid username' : 'Invalid username'}
                                </div>
                            )}
                            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4-24 characters<br />
                                Must begin with a letter<br />
                                Letters, numbers, underscores, hyphens allowed
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">
                                <FontAwesomeIcon icon={faEnvelope} className="field-icon" />
                                Email
                            </label>
                            <input
                                className={`form-input ${email && !validEmail ? 'input-error' : ''}`}
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="emailnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                                placeholder="Enter email address"
                            />
                            {email && (
                                <div className={`status-indicator ${validEmail ? 'valid' : 'invalid'}`}>
                                    <FontAwesomeIcon icon={validEmail ? faCheck : faTimes} />
                                    {validEmail ? 'Valid email' : 'Invalid email'}
                                </div>
                            )}
                            <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must be a valid email address
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">
                                <FontAwesomeIcon icon={faLock} className="field-icon" />
                                Password
                            </label>
                            <input
                                className={`form-input ${pwd && !validPwd ? 'input-error' : ''}`}
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                                placeholder="Enter password"
                            />
                            {pwd && (
                                <div className={`status-indicator ${validPwd ? 'valid' : 'invalid'}`}>
                                    <FontAwesomeIcon icon={validPwd ? faCheck : faTimes} />
                                    {validPwd ? 'Strong password' : 'Weak password'}
                                </div>
                            )}
                            <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8-24 characters<br />
                                Must include uppercase and lowercase letters, a number and a special character<br />
                                Allowed special characters: ! @ # $ %
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm_pwd">
                                <FontAwesomeIcon icon={faLock} className="field-icon" />
                                Confirm Password
                            </label>
                            <input
                                className={`form-input ${matchPwd && !validMatch ? 'input-error' : ''}`}
                                type="password"
                                id="confirm_pwd"
                                onChange={(e) => setMatchPwd(e.target.value)}
                                value={matchPwd}
                                required
                                aria-invalid={validMatch ? "false" : "true"}
                                aria-describedby="confirmnote"
                                onFocus={() => setMatchFocus(true)}
                                onBlur={() => setMatchFocus(false)}
                                placeholder="Confirm password"
                            />
                            {matchPwd && (
                                <div className={`status-indicator ${validMatch ? 'valid' : 'invalid'}`}>
                                    <FontAwesomeIcon icon={validMatch ? faCheck : faTimes} />
                                    {validMatch ? 'Passwords match' : 'Passwords do not match'}
                                </div>
                            )}
                            <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must match the first password input field
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="country">
                                <FontAwesomeIcon icon={faGlobe} className="field-icon" />
                                Country
                            </label>
                            <select
                                className="form-select"
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(Number(e.target.value))}
                                required
                            >
                                <option value="" disabled>Select your country</option>
                                <option value={1}>Russia</option>
                                <option value={2}>United States</option>
                                <option value={3}>Japan</option>
                                <option value={4}>Germany</option>
                                <option value={5}>United Kingdom</option>
                                <option value={6}>France</option>
                                <option value={7}>Canada</option>
                                <option value={8}>Australia</option>
                            </select>
                        </div>

                        <button 
                            className="form-button"
                            disabled={!validName || !validPwd || !validMatch || !validEmail}
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="form-helper">
                        Already have an account?{' '}
                        <Link to="/" className="form-link">Sign in here</Link>
                    </p>
                </div>
            )}
        </>
    );
};

export default Register;
