import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Col, Row } from 'react-bootstrap';

import config from '../config';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});


function MyPage() {
    const dispatch = useDispatch();
    const [cookies] = useCookies(['access_token']);

    const token = useSelector(
        state => state.token
    );

    return (
        <div className="MyPage">
            <Form style={{"margin":"50px 20% 0"}}>
                푼 문제(학생 전용)
                <hr />
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        닉네임
                    </Form.Label>
                    <Col sm={8}>
                        홍길동
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        이메일
                    </Form.Label>
                    <Col sm={8}>
                        SeaUCode@ajou.ac.kr
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        비밀번호 변경
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control type="password" placeholder="password" />
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        비밀번호 확인
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control type="password" placeholder="password" />
                    </Col>
                </Form.Group>

                <Button variant="primary w-100">수정</Button>

            </Form>
        </div>
    );
}

export default MyPage;