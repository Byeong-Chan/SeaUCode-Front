import React from 'react';
import './App.css';
import 'typescript';
import ResisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';

function App() {
    return (
        <div className="App">
            <ResisterForm/>
            <LoginForm/>
        </div>
    );
}

export default App;
