import React, {useState} from 'react';
import 'typescript';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });
const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const access_token = useSelector(
        state => state.token
    );

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