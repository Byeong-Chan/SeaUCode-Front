import React, { useState, useEffect, useRef } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Col, Row, Button, Dropdown, DropdownButton} from 'react-bootstrap';

import config from '../../config';
import generalFunctions from '../../generalFunctions';

import MonacoEditor from 'react-monaco-editor';

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
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
    const [codeSave, setCodeSave] = useCookies(['user_code' + '/' + id]);

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    const [language, setLanguage] = useState('c');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [code, setCode] = useState('');

    const options = {
        selectOnLineNumbers: true
    };

    function editorDidMount(editor, monaco) {
        setIsEditorReady(true);
        editor.focus();
    }

    const changeC = e => {
        setCodeSave('user_code' + '/' + id, code, { maxAge: 60*60*24*7, path: '/' });
        setLanguage('c');
    };
    const changeCpp = e => {
        setCodeSave('user_code' + '/' + id, code, { maxAge: 60*60*24*7, path: '/' });
        setLanguage('cpp');
    };
    const saveUserCode = () => {
        console.log(code);
        setCodeSave('user_code' + '/' + id, code, { maxAge: 60*60*24*7, path: '/' });
        alert('임시 저장 되었습니다!');
    };
    const backToDescription = () => {
        setCodeSave('user_code' + '/' + id, code, { maxAge: 60*60*24*7, path: '/' });
        props.history.push(url.slice(0, url.length - 11));
    };
    const submitUserCode = () => {
        setCodeSave('user_code' + '/' + id, code, { maxAge: 60*60*24*7, path: '/' });

        const problem_id = id;
        generalFunctions.loggedInTest(axios, cookies, dispatch)
            .then(result => {
                generalFunctions.axiosInit(axios, result.refresh_token);
                return axios.post('/pending/submitCode', {problem_number: problem_id, language: language, code: code});
            })
            .then(result => {
                alert('제출에 성공했습니다!');
            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.')
                }
                else if(err.response.data.message === 'auth-fail') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    removeCookies('access_token', {path: '/'});
                    props.history.push('/');
                    alert('로그인이 필요한 서비스입니다.');
                }
                else {
                    alert('제출에 실패했습니다...');
                }
        });
    };
    const onEditorChange = e => {
        setCode(e);
    };

    useEffect(() => {
        async function saveCodeUpdate() {
            if(codeSave['user_code' + '/' + id] === undefined || codeSave['user_code' + '/' + id] === '' || codeSave['user_code' + '/' + id] === null) {
                setCodeSave('user_code' + '/' + id, "// write your code here", { maxAge: 60*60*24*7, path: '/' });
                setCode("// write your code here");
            }
            else {
                setCode(codeSave['user_code' + '/' + id]);
            }
        };
        saveCodeUpdate();
    }, [codeSave]);

    return (
        <div className="Ide" style={{"height":"100%", "width":"100%"}}>
            <Row className="bg-dark">
                <Col lg={3}>
                    <Button variant="secondary" onClick={saveUserCode} disabled={!isEditorReady}>
                        임시 저장
                    </Button>
                </Col>

                <Col lg={1}>
                    <DropdownButton variant="secondary" id="dropdown-basic-button" title="언어 선택" disabled={!isEditorReady}>
                        <Dropdown.Item onClick={changeC}>C</Dropdown.Item>
                        <Dropdown.Item onClick={changeCpp}>C++</Dropdown.Item>
                    </DropdownButton>
                </Col>
                <Col lg={2} style={{color: "white"}}>
                    현재 언어 : {{'c': 'C', 'cpp': 'C++'}[language]}
                </Col>

                <Col lg={3}>
                    <Button variant="secondary" onClick={backToDescription} disabled={!isEditorReady}>
                        문제로 돌아가기
                    </Button>
                </Col>

                <Col lg={3}>
                    <Button variant="secondary" onClick={submitUserCode} disabled={!isEditorReady}>
                        제출!
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <MonacoEditor
                        width="100%"
                        height="90vh"
                        language={language}
                        theme="vs-dark"
                        value={code}
                        options={options}
                        onChange={onEditorChange}
                        editorDidMount={editorDidMount}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(Ide);