import React, {useEffect, useState} from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, ButtonToolbar, Nav, Navbar, Modal, Form, Row, Col} from 'react-bootstrap'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import LoginForm from "./LoginForm";
import axios from "axios";
import CreateClass from "./CreateClass";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function LoggedInUserTopNav() {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div className="LoginedUserTopNav">
            <Link to="/"><Button onClick={logout} variant="dark">로그아웃</Button></Link>
            <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>

            <Button variant="dark" onClick={handleShow}>
                마이페이지
            </Button>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>마이페이지</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
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

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        수정
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default LoggedInUserTopNav;