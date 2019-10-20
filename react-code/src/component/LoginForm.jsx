import React, { useState } from 'react';
import 'typescript';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

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
            if(err.response === undefined) {
                alert('서버와 연결이 끊어졌습니다.');
            }
            else if(err.response.data.message === "login-fail") {
                alert('비밀번호, 혹은 이메일이 다릅니다.');
            }
            else {
                alert('서버에 문제가 있습니다.');
            }
            console.log(err);
        });
    };

    return (
        <div className="LoginForm">
            <br/>
            < input value={email} placeholder="이메일" onChange={changeEmail}/>
            <br/>
            <input type="password" value={password} placeholder="비밀번호" onChange={changePassword}/>
            <br/>
            <button onClick={postLogin}>로그인</button>
        </div>
    );
}

export default LoginForm;