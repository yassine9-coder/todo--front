import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import '../styles/Register.css';

const Register = () => {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate(); // Get the navigate function

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        // Simple validation
        if (!email || !password) {
            setErrorMessage('Email and password are required.');
            return;
        }

        const requestBody = { email, password };

        console.log('Form data:', requestBody); 

        try {
            const response = await axios.post('http://localhost:8000/api/register', requestBody);
            setSuccessMessage(response.data.message);
            setErrorMessage('');

            // Redirect to the task interface upon successful registration
            navigate('/login'); // Replace with your actual path
        } catch (error) {
            console.error('Error response:', error.response);
            setErrorMessage(error.response?.data?.message || 'Registration failed.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="register-container">
            <img src={`${process.env.PUBLIC_URL}/images.png`} alt="Logo" className="logo" />
          
            <h3>Sign up</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
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
                <button type="submit" className="register-button">Sign Up</button>
            </form>
            <p>
                <Link to="/login" className="signin-link">Sign in to your account</Link>
            </p>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
};

export default Register;
