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
        renders.push(
            <tr key={item.problem_number}>
                <td>
                    <Link to={props.url+"/"+item.problem_number}>
                        {item.problem_number}
                    </Link>
                </td>
                <td>
                    <Link to={props.url+"/"+item.problem_number}>
                        {item.name}
                    </Link>
                </td>
                <td>
                    {category}
                </td>
            </tr>
        )
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

        const searchField = field !== '' ? constraint + '/' + field + '/' : '';

        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.get('/problems/getProblemList/' + searchField + 1)
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
        const nextPage = page + parseInt(e.target.value);
        setPage(nextPage);

        if(onSearch) {
            const searchField = field !== '' ? constraint + '/' + field + '/' : '';
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get('/problems/getProblemList/' + searchField + nextPage)
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
            axios.get('/problems/getProblemList/' + nextPage)
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
            setPage(1);
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get('/problems/getProblemList/' + 1)
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

    return (
        <div className="ProblemList" style={{"height":"100%"}}>
            <Row>
                <Form.Label column sm="1">검색 조건</Form.Label>
                <Col sm="3">
                    <Form.Control as="select" onChange={changeConstraint}>
                        <option value="name">문제 이름</option>
                        <option value="category">알고리즘 분류</option>
                    </Form.Control>
                </Col>
                <Col sm="5">
                    <Form.Control type="text" onChange={changeField} />
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
                            <ShowProblems problem_list={searchedProblemList} url={url}/>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(ProblemList);