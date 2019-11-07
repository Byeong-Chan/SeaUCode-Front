import React, { useState } from 'react';
import 'typescript';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Form, Card, Modal, Col, Row} from 'react-bootstrap';

import config from '../config';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });

function LoginForm(props) {
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
        axios.defaults.baseURL = config.serverURL;
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
        props.onHide();
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="LoginForm">
            <Card.Body>
                <Form>
                    <Form.Group as={Row} controlId="formBasicEmail">
                        <Form.Label column sm={4}>
                            이메일
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="email" placeholder="example@email.com" value={email} onChange={changeEmail} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} controlId="formBasicPassword">
                        <Form.Label column sm={4}>
                            비밀번호
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control type="password" placeholder="password" value={password} onChange={changePassword} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Col sm={{ span: 8, offset: 4 }}>
                            <Button variant="primary" type="button" onClick={postLogin} variant="dark">
                                login
                            </Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Modal>
    );
}

export default LoginForm;