import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch} from 'react-redux';
import 'typescript';
import {Col, Row, Container, Navbar, Button, Dropdown, DropdownButton, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../config';

import {
    Link,
    useParams,
    useRouteMatch,
    withRouter
} from "react-router-dom";

import generalFunctions from "../generalFunctions";
import MonacoEditor from "react-monaco-editor";
import ReactMarkdown from "react-markdown";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

const transEnum = {
    "1": "채점하는 중",
    "2": "맞았습니다!",
    "3": "틀렸습니다",
    "4": "시간 초과",
    "5": "메모리 초과",
    "6": "런타임 에러",
    "7": "출력 초과",
    "8": "컴파일 에러",
    "9": "채점 실패"
};

const textColor = {
    "1": "gray",
    "2": "green",
    "3": "red",
    "4": "red",
    "5": "red",
    "6": "blue",
    "7": "red",
    "8": "blue",
    "9": "black"
};

function JudgeResult(props) {
    const dispatch = useDispatch();
    const { path, url } = useRouteMatch();
    const { id } = useParams();
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const [judgeResult, setJudgeResult] = useState({});

    const options = {
        readOnly: true,
        selectOnLineNumbers: true
    };

    function editorDidMount(editor, monaco) {
        editor.focus();
    }

    useEffect(() => {
        async function getJudgeResult() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then(result => {
                    generalFunctions.axiosInit(axios, result.refresh_token);
                    return axios.get('/pending/getJudgeResultResultOne/' + id);
                })
                .then(result => {
                    setJudgeResult(result.data);
                }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와의 연결이 끊어졌습니다.');
                }
                else if(err.response === 'auth-fail') {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    removeCookie('access_token', {path: '/'});
                    props.history.push('/');
                    alert('로그인이 필요한 서비스입니다.');
                }
                else {
                    alert('오류가 발생했습니다.');
                }
            });
        };
        getJudgeResult();
    }, [cookies, dispatch, props.history, id, removeCookie]);

    return (
        <div className="Description" style={{"height":"100%"}}>
            <Row>
                <Col sm="12">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th> 채점 번호 </th>
                                <th> 문제 번호 </th>
                                <th> 결과 </th>
                                <th> 언어 </th>
                                <th> 시간 </th>
                                <th> 메모리 </th>
                                <th> 코드 길이 </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> {judgeResult.pending_number} </td>
                                <td> <Link to={"/problems/" + judgeResult.problem_number}> {judgeResult.problem_number} </Link> </td>
                                <td style={{color:textColor[judgeResult.state]}}> {transEnum[judgeResult.state]} </td>
                                <td> {{'c':'C', 'cpp':'C++', 'python':'Python', 'java':'Java'}[judgeResult.language]} </td>
                                <td> {judgeResult.time_usage / 1000} ms </td>
                                <td> {judgeResult.memory_usage / 1024} KB </td>
                                <td> {judgeResult.code === undefined ? '' : judgeResult.code.length} B </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col sm="12">
                    <ReactMarkdown source={`\`\`\`\n${judgeResult.ErrorMessage}\n\`\`\``} />
                </Col>
            </Row>
            <Row>
                <Col sm="12">
                    <MonacoEditor
                        width="100%"
                        height="90vh"
                        language={judgeResult.language}
                        theme="vs-white"
                        value={judgeResult.code}
                        options={options}
                        editorDidMount={editorDidMount}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(JudgeResult);