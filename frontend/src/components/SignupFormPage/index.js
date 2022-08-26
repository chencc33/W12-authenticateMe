import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignUpForm.css';

function SignupFormPage() {
    const dispatch = useDispatch();
    const history = useHistory()
    const sessionUser = useSelector((state) => state.session.user);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    // const [hasSubmitted, setHasSubmitted] = useState(false)


    // useEffect(() => {
    //     if (!firstName.length) errors.push('Please provide your first name')
    //     if (!lastName.length) errors.push('Please provide your last name')
    //     if (!(email.includes('@'))) errors.push('Please provide a valid email')
    //     if (!(email.endsWith('com') || email.endsWith('io') || email.endsWith('org'))) errors.push('Please provide a valid email')
    //     if (!username.length) errors.push('Please provide a username')
    //     if (!password.length) errors.push('Please provide your password')
    //     if (password !== confirmPassword) errors.push('Confirm Password field must be the same as the Password field')

    //     setErrors(errors)

    // }, [firstName, lastName, email, username, password])

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ firstName, lastName, email, username, password }))
                .catch(async (res) => {
                    const data = await res.json();
                    console.log('*****data****', data)
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };

    return (
        <form onSubmit={handleSubmit}>
            <ul>
                {errors.length > 0 && (errors.map((error, idx) => <li key={idx}>{error}</li>))}
            </ul>
            <label>First Name
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </label>
            <label>Last Name
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </label>
            <label>
                Email
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <label>
                Username
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
            <label>
                Confirm Password
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </label>
            <button type='submit'>Sign Up</button>
        </form>

    );
}

export default SignupFormPage;
