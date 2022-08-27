import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import './LoginForm.css'

function LoginForm() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const currentUser = useSelector((state) => state.session.user)
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password })).catch(
            async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    const err = Object.values(data.errors)
                    setErrors(err);
                }
            }
        );

    }

    return (
        <form onSubmit={handleSubmit} className='login-form'>
            <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error.message}</li>
                ))}
            </ul>
            <label>
                Username or Email
                <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
            </label>
            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type='sumbit'>Log In</button>
        </form>
    );
}

export default LoginForm;
