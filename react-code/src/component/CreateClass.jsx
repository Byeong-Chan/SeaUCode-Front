import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import config from '../config';
import generalFunctions from '../generalFunctions';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});


function CreateClass(props) {
    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const token = useSelector(
        state => state.token
    );

    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    useEffect(() => {
        async function login_check() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .catch(err => {
                    alert('로그인이 필요한 기능입니다!');
                    props.history.push('/');
                });
        };
        login_check();
    }, [cookies, dispatch]);

    const [ className, setClassName ] = useState('');

    const changeClassName = e => {
        setClassName(e.target.value);
    };

    const postCreateClass = e => {
        generalFunctions.axiosInit(axios, token);
        axios.post('/class/createClass', {name: className})
            .then(response => {
                props.history.push('/class/' + response.data['class_id']);
            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와의 연결이 끊어졌습니다.');
                }
                else if(err.response.data.message === 'auth-fail') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    props.history.push('/');
                    alert('로그인이 필요한 서비스입니다!');
                }
                else if(err.response.data.message === 'invalid-token') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    removeCookie('access_token', { path: '/' });
                    props.history.push('/');
                    alert('로그인에 문제가 생겼습니다. 다시 로그인해주세요.')
                }
                else if(err.response.data.message === 'role-auth-fail') {
                    props.history.push('/');
                    alert('선생님만 사용할 수 있는 기능입니다!');
                }
                else {
                    alert('서버에 문제가 생겼습니다.');
                }
        });
    };

    return (
        <div className="CreateClass">
            <Form style={{"marginTop":"200px"}}>
                <Row className="justify-content-xl-center">
                    <Col lg="6">
                        <h1 style={{"textAlign":"center"}}>
                            반 이름
                        </h1>
                    </Col>
                </Row>
                <Row className="justify-content-xl-center">
                    <Col lg="6">
                        <Form.Control value={className} size="lg" type="text" placeholder="반 이름 입력" onChange={changeClassName} />
                    </Col>
                </Row>
                <Row className="justify-content-xl-center" style={{"marginTop":"50px"}}>
                    <Col lg="auto">
                        <Button type="button" onClick={postCreateClass}>반 생성!</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default withRouter(CreateClass);