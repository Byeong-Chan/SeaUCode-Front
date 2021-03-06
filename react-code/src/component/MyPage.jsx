import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { Link, withRouter } from "react-router-dom";

import generalFunctions from "../generalFunctions";
import config from "../config";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});
const setUserName = input_name => ({ type: config.SET_USER_NAME, input_name});
const setUserEmail = input_email => ({ type: config.SET_USER_EMAIL, input_email});
const setUserNickname = input_nickname => ({ type: config.SET_USER_NICKNAME, input_nickname});

function MyPage(props) {
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
    const dispatch = useDispatch();

    const userName = useSelector(
        state => state.userName
    );
    const userNickname = useSelector(
        state => state.userNickname
    );
    const userEmail = useSelector(
        state => state.userEmail
    );

    const [rename, setRename] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [reboj, setReboj] = useState('');
    const [recodeforces, setRecodeforces] = useState('');
    const [respoj, setRespoj] = useState('');

    const changeRename = e => {
        setRename(e.target.value);
    };
    const changePassword = e => {
        setPassword(e.target.value);
    };
    const changeConfirmPassword = e => {
        setConfirmPassword(e.target.value);
    };
    const changeReboj = e => {
        setReboj(e.target.value);
    };
    const changeRecodeforces = e => {
        setRecodeforces(e.target.value);
    };
    const changeRespoj = e => {
        setRespoj(e.target.value);
    };

    const updateUserInfo = e => {
        if(password.length === 0) {
            alert('바꿀 비밀번호를 반드시 입력해주세요. 바꾸지 않을것이라면 원래 비밀번호를 입력해주세요.');
        }
        else if(password !== confirmPassword) {
            alert('비밀번호가 일치하는지 확인하세요.');
        }
        else if(rename.length === 0) {
            alert('바꿀 이름을 입력해주세요.');
        }
        else {
            generalFunctions.axiosInit(axios, cookies.access_token);
            axios.post('/user/userRevise', {name: rename, password: password, boj_id: reboj, codeforces_id: recodeforces, spoj_id: respoj})
                .then(result => {
                    dispatch(setUserName(rename));
                    alert('성공적으로 변경 되었습니다.');
                }).catch(err => {
                    if(err.response === undefined) {
                        alert('서버와 연결이 끊어졌습니다.');
                    }
                    else if(err.response.data.message === 'update failure') {
                        alert('업데이트에 실패했습니다.');
                    }
                    else if(err.response.data.message === 'not found') {
                        alert('로그인 정보가 잘못 되었습니다. 다시 로그인 해주세요.');
                        dispatch(setToken(''));
                        dispatch(toggleLoggedIn(false));
                        removeCookies('access_token', {path: '/'});
                        props.history.push('/');
                    }
                    else {
                        alert('서버에 문제가 생겼습니다.');
                    }
            });
        }
    };

    const deleteUser = e => {
        const answer = window.confirm('정말로 삭제하시겠습니까? 삭제 이후 계정정보는 복구 할 수 없습니다.');
        if(answer) {
            generalFunctions.axiosInit(axios, cookies.access_token);
            axios.delete('/user/userDelete')
                .then(result => {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    dispatch(setUserEmail(''));
                    dispatch(setUserName(''));
                    dispatch(setUserNickname(''));
                    removeCookies('access_token', {path: '/'});
                    props.history.push('/');
                    alert('성공적으로 탈퇴되었습니다.');
                }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.');
                }
                else if(err.response.data.message === 'user do not exist') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    dispatch(setUserEmail(''));
                    dispatch(setUserName(''));
                    dispatch(setUserNickname(''));
                    removeCookies('access_token', {path: '/'});
                    props.history.push('/');
                    alert('로그인 정보가 잘못되었습니다. 다시 로그인 해주세요.');
                }
                else {
                    alert('서버에 문제가 생겼습니다.');
                }
            });
        }
    };

    useEffect(() => {
        async function cookie_update() {
            const refresh_token = cookies.access_token || '';

            generalFunctions.axiosInit(axios, refresh_token);
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .catch(err => {
                    alert('로그인이 필요한 기능입니다!');
                    props.history.push('/');
                });
        };
        cookie_update();
    }, [cookies, dispatch, props.history]);

    return (
        <div className="MyPage">
            <Form style={{"margin":"50px 20% 0"}}>
                <Row>
                    <Col md="6" sm="12" style={{marginBottom: "10px"}}>
                        <Link to="/myJudges"><Button variant="outline-dark" size="lg" block>내 제출 기록</Button></Link>
                    </Col>
                    <Col md="6" sm="12">
                        <Link to="/myAssignment"><Button variant="outline-dark" size="lg" block>나의 과제</Button></Link>
                    </Col>
                </Row>
                <hr />
                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>닉네임</b>
                    </Form.Label>
                    <Col sm={8}>
                        {userNickname}
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>실명*</b>
                    </Form.Label>
                    <Col sm={4}>
                        {userName}
                    </Col>
                    <Col sm={4}>
                        <Form.Control value={rename} type="text" placeholder="이름 수정" onChange={changeRename}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>이메일</b>
                    </Form.Label>
                    <Col sm={8}>
                        {userEmail}
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>비밀번호 변경*</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control value={password} type="password" placeholder="password" onChange={changePassword}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>비밀번호 확인*</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control value={confirmPassword} type="password" placeholder="password" onChange={changeConfirmPassword}/>
                    </Col>
                </Form.Group>

                <hr />

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>백준 ID</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control value={reboj} type="text" placeholder="백준 ID 수정" onChange={changeReboj}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>코드포스 Handle</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control value={recodeforces} type="text" placeholder="코드포스 Handle 수정" onChange={changeRecodeforces}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={4}>
                        <b>SPOJ ID</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control value={respoj} type="text" placeholder="SPOJ ID 수정" onChange={changeRespoj}/>
                    </Col>
                </Form.Group>

                <Row>
                    <Col sm="12" style={{marginBottom: "10px"}}>
                        <Button variant="primary" block onClick={updateUserInfo}>수정</Button>
                    </Col>
                    <Col sm="12">
                        <Button variant="danger" block onClick={deleteUser}>삭제</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default withRouter(MyPage);