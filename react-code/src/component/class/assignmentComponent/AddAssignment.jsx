import React, { useEffect, useState } from 'react';
import 'typescript';
import {Container, Col, Row, Button, Form, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

import SelectedAssignment from "./SelectedAssignment";

import {
    Link,
    useRouteMatch,
    withRouter
} from "react-router-dom";

const selectedProblem = [];
const selectedProblemNum = [];
const addProblem = e => {
    let count = 0;
    for(let i = 0; i < selectedProblem.length; i ++) {
        if (e.toString() == selectedProblem[i].toString()) {
            count++;
        }
    }
    if(count == 0) {
        selectedProblem.push(e);
        selectedProblemNum.push(e[0]);
    } else {
        alert("이미 추가된 문제입니다.")
    }
}

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
                <td>
                    <Button onClick={(e) => addProblem([item.problem_number, item.name, category])} variant="primary" size="sm">
                        추가
                    </Button>
                </td>
            </tr>
        )
    }
    return renders;
}

function AddAssignment(props) {

    const { url } = useRouteMatch();

    const [onSearch, setOnSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [field, setField] = useState('');
    const [constraint, setConstraint] = useState('name');
    const [searchedProblemList, setSearchedProblemList] = useState([]);
    const [selectedProblemList, setSelectedProblemList] = useState([]);

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
                    setSelectedProblemList(selectedProblem);
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

    const postAsgButton = {
        position: "absolute",
        top: "20px",
        right: "110px"
    }
    const goBackButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    }
    const nextButton = {
        position: "absolute",
        top: "-5px",
        right: "80px",
        width: "60px"
    }
    const prevButton = {
        position: "absolute",
        top: "-5px",
        right: "15px",
        width: "60px"
    }

    return (
        <Container>
            <h3 style={{marginTop: "20px"}}>새 과제 출제</h3>
            <Button style={postAsgButton}>출제하기</Button>
            <Button variant="secondary" onClick={() => props.history.goBack(`${url}`)} style={goBackButton}>뒤로가기</Button>
            <hr/>
            <Row>
                <Col lg={6} md={12}>
                    <h6 style={{fontWeight: "bold"}}>[문제 목록]</h6>
                    <Button value={-1} onClick={changePage} style={nextButton} variant="outline-dark" size="sm">이전</Button>
                    <Button value={1} onClick={changePage} style={prevButton} variant="outline-dark" size="sm">다음</Button>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>문제명</th>
                            <th>분류</th>
                            <th>선택</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th>1231</th>
                            <th>문제명</th>
                            <th>분류</th>
                            <th>
                                <Button onClick={(e) => addProblem([12341, "문제2", "카테2"])} variant="primary" size="sm">
                                    추가
                                </Button>
                            </th>
                        </tr>
                        <tr>
                            <th>34242</th>
                            <th>문제명</th>
                            <th>분류</th>
                            <th>
                                <Button onClick={(e) => addProblem([34242, "문제1", "카테1"])} variant="primary" size="sm">
                                    추가
                                </Button>
                            </th>
                        </tr>
                            <ShowProblems problem_list={searchedProblemList} url={url}/>
                        </tbody>
                    </Table>
                    <div style={{marginBottom: "30px", display: "flex", textAlign: "center"}}>
                        <Form.Control as="select" onChange={changeConstraint} style={{width: "33%"}}>
                            <option value="name">문제 이름</option>
                            <option value="category">알고리즘 분류</option>
                        </Form.Control>
                        <Form.Control type="text" onChange={changeField} style={{width: "50%", marginLeft: "5px"}}/>
                        <Button onClick={findProblems} variant="outline-primary" style={{marginLeft: "5px"}}>검색</Button>
                    </div>
                </Col>
                <SelectedAssignment selectedProblem={selectedProblemList}/>
            </Row>
        </Container>
    );
}

export default withRouter(AddAssignment);