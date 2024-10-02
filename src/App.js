import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login'; // Assuming you have a Login component
import Tach from './components/Tach'; // 'Tach' should match the file name exactly


const App = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Route for the tasks (form and task list) */}
            <Route path="/tasks" element={<Tach />} />

            {/* Redirect to /register by default */}
            <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
    );
};

export default App;
