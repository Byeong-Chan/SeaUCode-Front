import React, { useEffect, useState } from 'react';
import 'typescript';
import {Col, Row, Button, Form, Table} from 'react-bootstrap';
import axios from 'axios';

import config from '../../config';

import {
    Link,
    useRouteMatch,
    withRouter
} from "react-router-dom";

function ShowProblems(props) {
    const renders = [];
    for(let i = 0; i < props.problem_list.length; i++) {
        const item = props.problem_list[i];

        let category = '';
        for(let i = 0; i < item.Category.length; i++) {
            category = category + item.Category[i];
            if(i < item.Category.length - 1) category = category + ', ';
        }

        if(item.problem_number.toString().split('/')[0] === 'spoj' ||
            item.problem_number.toString().split('/')[0] === 'boj' ||
            item.problem_number.toString().split('/')[0] === 'codeforces') {

            let outerUrl = '';
            if(props.oj === 'codeforces') {
                let codeforcesURL = '';
                for(let i = 10; i < item.problem_number.length; i++) {
                    if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(item.problem_number[i]) !== -1) {
                        codeforcesURL += '/';
                    }
                    codeforcesURL += item.problem_number[i];
                }
                outerUrl = `https://codeforces.com/problemset/problem/${codeforcesURL}`;
            }
            else if(props.oj === 'boj') {
                outerUrl = `https://www.acmicpc.net/problem/${item.problem_number.split('/')[1]}`;
            }
            else {
                outerUrl = `https://www.spoj.com/problems/${item.problem_number.split('/')[1]}`;
            }
            renders.push(
                <tr key={item.problem_number}>
                    <td>
                        <a href={outerUrl}>
                            {item.problem_number}
                        </a>
                    </td>
                    <td>
                        <a href={outerUrl}>
                            {item.name}
                        </a>
                    </td>
                    <td>
                        {category}
                    </td>
                </tr>
            )
        }
        else {
            renders.push(
                <tr key={item.problem_number}>
                    <td>
                        <Link to={props.url + "/" + item.problem_number}>
                            {item.problem_number}
                        </Link>
                    </td>
                    <td>
                        <Link to={props.url + "/" + item.problem_number}>
                            {item.name}
                        </Link>
                    </td>
                    <td>
                        {category}
                    </td>
                </tr>
            )
        }
    }
    return renders;
}

function ProblemList(props) {
    const { url } = useRouteMatch();

    const [onSearch, setOnSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [field, setField] = useState('');
    const [constraint, setConstraint] = useState('name');
    const [searchedProblemList, setSearchedProblemList] = useState([]);

    const [oj, setOj] = useState('SeaUCode');
    const [outer, setOuter] = useState('');

    const changeConstraint = e => {
        setConstraint(e.target.value);
    };

    const changeField = e => {
        setField(e.target.value);
    };

    const findProblems = e => {
        setPage(1);
        if(field !== '') setOnSearch(true);
        else setOnSearch(false);

        const getProblemUrl = `/problems/get${outer}ProblemList${outer === 'Out' ? '/' + oj : ''}/`;
        const searchField = field !== '' ? constraint + '/' + field + '/' : '';

        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.get(getProblemUrl + searchField + 1)
            .then(result => {
                setSearchedProblemList(result.data.problem_list);
            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와의 연결이 끊어졌습니다.');
                }
                else {
                    alert('오류가 발생했습니다.');
                }
        });
    };

    const changePage = e => {
        if(parseInt(e.target.value) > 0) {
            if(searchedProblemList.length < 15)
                return;
        }
        if(parseInt(e.target.value) < 0) {
            if(page === 1)
                return;
        }
        const getProblemUrl = `/problems/get${outer}ProblemList${outer === 'Out' ? '/' + oj : ''}/`;
        const nextPage = page + parseInt(e.target.value);
        setPage(nextPage);

        if(onSearch) {
            const searchField = field !== '' ? constraint + '/' + field + '/' : '';
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get(getProblemUrl + searchField + nextPage)
                .then(result => {
                    setSearchedProblemList(result.data.problem_list);
                }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와의 연결이 끊어졌습니다.');
                }
                else {
                    alert('오류가 발생했습니다.');
                }
            });
        }
        else {
            axios.get(getProblemUrl + nextPage)
                .then(result => {
                    setSearchedProblemList(result.data.problem_list);
                }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와의 연결이 끊어졌습니다.');
                }
                else {
                    alert('오류가 발생했습니다.');
                }
            });
        }
    };

    useEffect(() => {
        async function getFirstPage() {
            const getProblemUrl = `/problems/get${outer}ProblemList${outer === 'Out' ? '/' + oj : ''}/`;
            setPage(1);
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get(getProblemUrl + 1)
                .then(result => {
                    setSearchedProblemList(result.data.problem_list);
                }).catch(err => {
                    if(err.response === undefined) {
                        alert('서버와의 연결이 끊어졌습니다.');
                    }
                    else {
                        alert('오류가 발생했습니다.');
                    }
            });
        };
        getFirstPage();
    }, []);

    const enterKeyPress = (e) => {
        if(e.key === 'Enter'){
            findProblems();
        }
    };

    const changeOj = e => {
        let newOuter = 'Out';
        setOj(e.target.value);
        if(e.target.value === 'SeaUCode') newOuter = '';
        setOuter(newOuter);
    };

    return (
        <div className="ProblemList" style={{"height":"100%"}}>
            <Row>
                <Form.Label column sm="1">검색 조건</Form.Label>
                <Col sm="2">
                    <Form.Control as="select" onChange={changeOj}>
                        <option value="SeaUCode">씨유코드</option>
                        <option value="boj">백준 온라인 저지</option>
                        <option value="codeforces">코드포스</option>
                        <option value="spoj">Sphere 온라인 저지</option>
                    </Form.Control>
                </Col>
                <Col sm="3">
                    <Form.Control as="select" onChange={changeConstraint}>
                        <option value="name">문제 이름</option>
                        <option value="category">알고리즘 분류</option>
                    </Form.Control>
                </Col>
                <Col sm="3">
                    <Form.Control type="text" onChange={changeField} onKeyPress={enterKeyPress}/>
                </Col>
                <Col sm="1">
                    <Button onClick={findProblems}>검색</Button>
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
                                <th>번호</th>
                                <th>문제 이름</th>
                                <th>알고리즘 분류</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ShowProblems problem_list={searchedProblemList} url={url} outer={outer} oj={oj}/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(ProblemList);