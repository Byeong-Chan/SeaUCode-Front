import React, { useState, useEffect, useRef } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Col, Row, Container, Navbar, Button, Dropdown, DropdownButton} from 'react-bootstrap';

import config from '../../config';
import generalFunctions from '../../generalFunctions';

import Editor from '@monaco-editor/react';

import {
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Ide(props) {
    const { url } = useRouteMatch();
    const { id } = useParams();

    const dispatch = useDispatch();
    const [cookies] = useCookies(['access_token']);
    const [codeSave, setCodeSave] = useCookies(['user_code' + '/' + id]);

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    const [language, setLanguage] = useState('c');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const valueGetter = useRef();

    function handleEditorDidMount(_valueGetter) {
        setIsEditorReady(true);
        valueGetter.current = _valueGetter;
    }

    const changeC = e => {
        setLanguage('c');
    };
    const changeCpp = e => {
        setLanguage('cpp');
    };
    const saveUserCode = () => {
        setCodeSave('user_code' + '/' + id, valueGetter.current(), { maxAge: 60*60*24*7, path: '/' });
        alert('임시 저장 되었습니다!');
    };
    const backToDescription = () => {
        setCodeSave('user_code' + '/' + id, valueGetter.current(), { maxAge: 60*60*24*7, path: '/' });
        props.history.push(url.slice(0, url.length - 11));
    };
    const submitUserCode = () => {
        const code = valueGetter.current();
        const problem_id = id;
        generalFunctions.axiosInit(axios, token);
        axios.post('/pending/submitCode', {problem_number: problem_id, language: language, code: code})
            .then(result => {
                alert('제출에 성공했습니다!');
            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.')
                }
                else if(err.response.data.message === 'auth-fail') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    props.history.push('/');
                    alert('로그인이 필요한 서비스입니다.');
                }
                else {
                    alert('제출에 실패했습니다...');
                }
        });
    };

    useEffect(() => {
        async function saveCodeUpdate() {
            if(codeSave['user_code' + '/' + id] === undefined || codeSave['user_code' + '/' + id] === '' || codeSave['user_code' + '/' + id] === null) {
                setCodeSave('user_code' + '/' + id, "// write your code here", { maxAge: 60*60*24*7, path: '/' });
            }
        };
        saveCodeUpdate();
    }, [codeSave]);

    return (
        <div className="Ide" style={{"height":"100%"}}>
            <Row>
                <Col sm={3}>
                    <Button onClick={saveUserCode} disabled={!isEditorReady}>
                        임시 저장
                    </Button>
                </Col>

                <Col sm={1}>
                    <DropdownButton id="dropdown-basic-button" title="언어 선택" disabled={!isEditorReady}>
                        <Dropdown.Item onClick={changeC}>C</Dropdown.Item>
                        <Dropdown.Item onClick={changeCpp}>C++</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col sm={2}>
                    현재 언어 : {{'c': 'C', 'cpp': 'C++'}[language]}
                </Col>

                <Col sm={3}>
                    <Button onClick={backToDescription} disabled={!isEditorReady}>
                        문제로 돌아가기
                    </Button>
                </Col>

                <Col sm={3}>
                    <Button onClick={submitUserCode} disabled={!isEditorReady}>
                        제출!
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Editor
                        height="90vh"
                        language={language}
                        value={codeSave['user_code' + '/' + id]}
                        editorDidMount={handleEditorDidMount}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(Ide);