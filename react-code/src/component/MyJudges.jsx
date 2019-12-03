import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import 'typescript';
import {Col, Row, Button, Form, Table} from 'react-bootstrap';
import axios from 'axios';

import config from '../config';

import {
    Link,
    useRouteMatch,
    withRouter
} from "react-router-dom";
import generalFunctions from "../generalFunctions";

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

function ShowProblems(props) {
    const renders = [];
    for(let i = 0; i < props.problem_list.length; i++) {
        const item = props.problem_list[i];
        renders.push(
            <tr key={item.pending_number}>
                <td>
                    <Link to={"/myJudges/"+item.pending_number}>
                        {item.pending_number}
                    </Link>
                </td>
                <td>
                    <Link to={"/problems/"+item.problem_number}>
                        {item.problem_number}
                    </Link>
                </td>
                <td>
                    {{'c':'C', 'cpp':'C++', 'python':'Python', 'java':'Java'}[item.language]}
                </td>
                <td style={{color:textColor[item.state]}}>
                    {transEnum[item.state]}
                </td>
                <td>
                    {item.state === 2 ? `${item.time_usage}ms` : ''}
                </td>
                <td>
                    {item.state === 2 ? `${item.memory_usage / 1024}KB` : ''}
                </td>
                <td>
                    {`${item.code_length}B`}
                </td>
            </tr>
        )
    }
    return renders;
}

function MyJudges(props) {
    const { url } = useRouteMatch();

    const dispatch = useDispatch();
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const [onSearch, setOnSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [field, setField] = useState('');
    const [constraint, setConstraint] = useState('pending_number');
    const [searchedJudgeList, setSearchedJudgeList] = useState([]);

    const changeConstraint = e => {
        setConstraint(e.target.value);
    };

    const changeField = e => {
        setField(e.target.value);
    };

    const findJudges = e => {
        setPage(1);
        if(field !== '') setOnSearch(true);
        else setOnSearch(false);

        const searchField = field !== '' ? constraint + '/' + field + '/' : '';

        generalFunctions.loggedInTest(axios, cookies, dispatch)
            .then(result => {
                generalFunctions.axiosInit(axios, result.refresh_token);
                return axios.get('/pending/getJudgeResultList/' + searchField + 1)
            }).then(result => {
                setSearchedJudgeList(result.data.judge_result_list);
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

    const changePage = e => {
        if(parseInt(e.target.value) > 0) {
            if(searchedJudgeList.length < 15)
                return;
        }
        if(parseInt(e.target.value) < 0) {
            if(page === 1)
                return;
        }
        const nextPage = page + parseInt(e.target.value);
        setPage(nextPage);

        if(onSearch) {
            const searchField = field !== '' ? constraint + '/' + field + '/' : '';

            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then(result => {
                    generalFunctions.axiosInit(axios, result.refresh_token);
                    return axios.get('/pending/getJudgeResultList/' + searchField + nextPage);
                }).then(result => {
                    setSearchedJudgeList(result.data.judge_result_list);
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
        }
        else {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then(result => {
                    generalFunctions.axiosInit(axios, result.refresh_token);
                    return axios.get('/pending/getJudgeResultList/' + nextPage);
                })
                .then(result => {
                    setSearchedJudgeList(result.data.judge_result_list);
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
        }
    };

    useEffect(() => {
        async function getFirstPage() {
            setPage(1);
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then(result => {
                    generalFunctions.axiosInit(axios, result.refresh_token);
                    return axios.get('/pending/getJudgeResultList/' + 1);
                })
                .then(result => {
                    setSearchedJudgeList(result.data.judge_result_list);
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
        getFirstPage();
    }, [cookies, dispatch, props.history, removeCookie]);

    return (
        <div className="MyJudges" style={{"height":"100%"}}>
            <Row>
                <Form.Label column sm="1">검색 조건</Form.Label>
                <Col sm="3">
                    <Form.Control as="select" onChange={changeConstraint}>
                        <option value="pending_number">채점 번호</option>
                        <option value="problem_number">문제 번호</option>
                    </Form.Control>
                </Col>
                <Col sm="5">
                    <Form.Control type="text" onChange={changeField} />
                </Col>
                <Col sm="1">
                    <Button onClick={findJudges}>검색</Button>
                </Col>
                <Col sm="1">
                    <Button value={-1} onClick={changePage}>이전</Button>
                </Col>
                <Col sm="1">
                    <Button value={1} onClick={changePage}>다음</Button>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>채점 번호</th>
                            <th>문제 번호</th>
                            <th>언어</th>
                            <th>결과</th>
                            <th>시간</th>
                            <th>메모리</th>
                            <th>코드 길이</th>
                        </tr>
                        </thead>
                        <tbody>
                        <ShowProblems problem_list={searchedJudgeList} url={url}/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(MyJudges);