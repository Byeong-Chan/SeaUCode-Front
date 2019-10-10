import React, { useEffect, useState } from 'react';
import './App.css';
import 'typescript';
import ResisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';
import UserUI from './component/UserUI';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });

function Greeting(props) {
    if(props.isLogedIn) {
        return <UserUI />;
    }
    else {
        return <LoginForm />;
    }
}

function App() {

    const [isLogedIn, toggleLogedIn] = useState(false);

    const [cookies] = useCookies(['access_token']);

    const dispatch = useDispatch();

    useEffect(() => {
        async function cookie_update() {
            const refresh_token = cookies.access_token || '';
            dispatch(setToken(refresh_token));

            axios.defaults.baseURL = 'http://127.0.0.1:3000';
            axios.defaults.headers.common['x-access-token'] = refresh_token;
            axios.get('/logintest').then(response => { // TODO: logintest 가 아니라 유저정보 가져오는 쿼리를 쓸것
                //TODO: redux에 유저정보 저장하고 시작할 것
                toggleLogedIn(true);
            }).catch(err => {
                toggleLogedIn(false);
            });
        };
        cookie_update();
    }, [cookies, dispatch]);

    return (
        <div className="App">
            <ResisterForm/>
            <Greeting isLogedIn={isLogedIn}/>
        </div>
    );
}

export default App;
