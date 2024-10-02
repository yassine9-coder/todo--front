import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import '../styles/Login.css'; // Import your CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Simple validation
        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        const requestBody = { email, password };

        try {
            const response = await axios.post('http://localhost:8000/api/login', requestBody);
            const token = response.data.token; // Adjust based on your response structure
            const userId = response.data.id; // Adjust based on your response structure

        // Store the user ID in local storage
        localStorage.setItem('userId', userId);
            // Store the token in local storage
            localStorage.setItem('token', token);

            setSuccessMessage('Login successful!');
            setErrorMessage('');

            // Navigate to the tasks page upon successful login
            navigate('/tasks');
        } catch (error) {
            console.error('Error response:', error.response);
            setErrorMessage(error.response?.data?.message || 'Login failed.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="login-container">
            <img src={`${process.env.PUBLIC_URL}/images.png`} alt="Logo" className="logo" />
            <h3>Sign In</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Sign In</button>
            </form>
            <p>
                <Link to="/register" className="signup-link">Don't have an account? Sign up</Link>
            </p>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default Login;
