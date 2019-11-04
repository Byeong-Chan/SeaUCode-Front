import React, { useState } from 'react';
import 'typescript';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Button, Form, Card } from 'react-bootstrap';

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
        <Card style={{ width: '18rem' }} className="LoginForm">
            <Card.Body>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control type="email" placeholder="example@email.com" value={email} onChange={changeEmail} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>비밀번호</Form.Label>
                        <Form.Control type="password" placeholder="password" value={password} onChange={changePassword} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={postLogin}>
                        login
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default LoginForm;