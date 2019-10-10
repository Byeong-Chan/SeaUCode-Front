import React, { useState, useEffect } from 'react';
import 'typescript';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });
const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cookies, setCookie] = useCookies(['access_token']);

    const access_token = useSelector(
        state => state.token
    );

    const dispatch = useDispatch();

    useEffect(() => {
        async function cookie_update() {
            const refresh_token = cookies.access_token || '';
            dispatch(setToken(refresh_token));
        };
        cookie_update();
    }, [cookies, dispatch]);

    const changeEmail = e => {
        setEmail(e.target.value);
    };
    const changePassword = e => {
        setPassword(e.target.value);
    };
    const postLogin = e => {
        axios.defaults.baseURL = 'http://127.0.0.1:3000';
        axios.post('/login',
            {email: email, password: password}).then(response => {
            dispatch(setToken(response.data.token));
            setCookie('access_token', response.data.token, { maxAge: 60*60*24*7 });
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="LoginForm">
            <br/>
            <input value={email} placeholder="이메일" onChange={changeEmail}/>
            <br/>
            <input type="password" value={password} placeholder="비밀번호" onChange={changePassword}/>
            <br/>
            <button onClick={postLogin}>로그인</button>
        </div>
    );
}

export default LoginForm;