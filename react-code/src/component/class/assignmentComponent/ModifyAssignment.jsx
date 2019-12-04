import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import 'typescript';
import {Container, Col, Row, Button, Form, Table, InputGroup} from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

import SelectedAssignment from "./SelectedAssignment";

import {
    Link,
    useParams,
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
                    <Link to={"/problems/"+item.problem_number}>
                        {item.problem_number}
                    </Link>
                </td>
                <td>
                    <Link to={"/problems/"+item.problem_number}>
                        {item.name}
                    </Link>
                </td>
                <td>
                    {category}
                </td>
                <td>
                    <Button onClick={(e) => props.addProblem(item)} variant="primary" size="sm">
                        추가
                    </Button>
                </td>
            </tr>
        )
    }
    return renders;
}

function ModifyAssignment(props) {

    const dispatch = useDispatch();

    const { url } = useRouteMatch();
    const { id, student_id, assignment_id } = useParams();

    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const [onSearch, setOnSearch] = useState(false);
    const [page, setPage] = useState(1);
    const [field, setField] = useState('');
    const [constraint, setConstraint] = useState('name');
    const [searchedProblemList, setSearchedProblemList] = useState([]);
    const [selectedProblemList, setSelectedProblemList] = useState([]);
    const [assignmentName, setAssignmentName] = useState('');

    const [sYear, setSYear] = useState(0);
    const [sMonth, setSMonth] = useState(0);
    const [sDay, setSDay] = useState(0);
    const [sHour, setSHour] = useState(0);
    const [sMinute, setSMinute] = useState(0);

    const [eYear, setEYear] = useState(0);
    const [eMonth, setEMonth] = useState(0);
    const [eDay, setEDay] = useState(0);
    const [eHour, setEHour] = useState(0);
    const [eMinute, setEMinute] = useState(0);

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

    const postAssignment = e => {
        const maxD = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if(sYear < 1970 || 2100 < sYear) {
            alert('1970 ~ 2100 년 사이로 입력해주세요.');
            return;
        }
        if(sMonth < 1 || 12 < sMonth) {
            alert('1 ~ 12 월 사이로 입력해주세요.');
            return;
        }

        if(sYear % 400 === 0 || (sYear % 4 === 0 && sYear % 100 !== 0)) maxD[2] = 29;
        if(sDay < 1 || maxD[sMonth] < sDay) {
            alert(`1 ~ ${maxD[sMonth]} 일 사이로 입력해주세요.`);
            return;
        }

        if(sHour < 0 || 23 < sHour) {
            alert('0 ~ 23 시 사이로 입력해주세요.');
            return;
        }

        if(sMinute < 0 || 59 < sMinute) {
            alert('0 ~ 59 분 사이로 입력해주세요.');
            return;
        }



        if(eYear < 1970 || 2100 < eYear) {
            alert('1970 ~ 2100 년 사이로 입력해주세요.');
            return;
        }
        if(eMonth < 1 || 12 < eMonth) {
            alert('1 ~ 12 월 사이로 입력해주세요.');
            return;
        }

        if(eYear % 400 === 0 || (eYear % 4 === 0 && eYear % 100 !== 0)) maxD[2] = 29;
        if(eDay < 1 || maxD[eMonth] < eDay) {
            alert(`1 ~ ${maxD[eMonth]} 일 사이로 입력해주세요.`);
            return;
        }

        if(eHour < 0 || 23 < eHour) {
            alert('0 ~ 23 시 사이로 입력해주세요.');
            return;
        }

        if(eMinute < 0 || 59 < eMinute) {
            alert('0 ~ 59 분 사이로 입력해주세요.');
            return;
        }

        const start_date = new Date(sYear, sMonth - 1, sDay, sHour, sMinute, 0, 0);
        const end_date = new Date(eYear, eMonth - 1, eDay, eHour, eMinute, 0, 0);

        if(start_date > end_date) {
            alert('시작 시간이 끝 시간보다 나중일 수 없습니다!');
            return;
        }

        const problem_list = [];
        selectedProblemList.map((item, i) => problem_list.push(item.problem_number));

        if(problem_list.length === 0) {
            alert('한 문제 이상을 입력해주세요.');
            return;
        }
        const reqData = {
            user_nickname : student_id,
            name  : assignmentName,
            problem_list : problem_list,
            start_date : start_date,
            end_date : end_date,
            classroom_id: id,
            assignment_id: assignment_id
        };

        generalFunctions.loggedInTest(axios, cookies, dispatch).then(result => {
            generalFunctions.axiosInit(axios, result.refresh_token);
            return axios.post('/problems/updateAssignment', reqData);
        }).then(result => {
            alert('과제 수정 성공');
            props.history.goBack(`${url}`);
        }).catch(err => {
            if(err.response === undefined) {
                alert('서버와 연결이 끊어졌습니다.');
            }
            else {
                alert('과제 출제에 실패하였습니다..');
            }
        })
    };

    useEffect(() => {
        async function getFirstPage() {
            setPage(1);
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get('/problems/getProblemList/' + 1)
                .then(result => {
                    setSearchedProblemList(result.data.problem_list);
                    generalFunctions.axiosInit(axios, cookies.access_token);
                    return axios.get(`/assignment/getAssignmentForModifying/${assignment_id}`);
                }).then(result => {
                    const sdate = new Date(result.data.start_date);
                    const edate = new Date(result.data.end_date);

                    setSYear(sdate.getFullYear());
                    setSMonth(sdate.getMonth() + 1);
                    setSDay(sdate.getDate());
                    setSHour(sdate.getHours());
                    setSMinute(sdate.getMinutes());

                    setEYear(edate.getFullYear());
                    setEMonth(edate.getMonth() + 1);
                    setEDay(edate.getDate());
                    setEHour(edate.getHours());
                    setEMinute(edate.getMinutes());

                    setSelectedProblemList(result.data.problem_list);
                    setAssignmentName(result.data.name);
                }).catch(err => {
                    console.log(err);
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
    };
    const goBackButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    };
    const nextButton = {
        position: "absolute",
        top: "-5px",
        right: "80px",
        width: "60px"
    };
    const prevButton = {
        position: "absolute",
        top: "-5px",
        right: "15px",
        width: "60px"
    };
    const subTitle = {
        fontWeight: "bold",
        color: "darkslategray",
        marginBottom: "0px"
    }
    const dateStyle = {
        padding: "0",
        minWidth: "100px"
    }
    const dateText = {
        width: "30px",
        padding: "3px 10px 3px 5px"
    }

    function addProblem(problem) {
        if(selectedProblemList.find(e => e.problem_number === problem.problem_number) !== undefined) {
            alert('이미 추가된 문제입니다.');
        }
        else {
            const newSelectedProblemList = selectedProblemList.concat(problem);
            newSelectedProblemList.sort((a, b) => {
                if(a.problem_number < b.problem_number) return -1;
                if(a.problem_number > b.problem_number) return 1;
                return 0;
            });
            setSelectedProblemList(newSelectedProblemList);
        }
    }
    const removeProblem = e => {
        const newSelectedProblemList = selectedProblemList.concat();
        if(newSelectedProblemList.findIndex(elem => elem.problem_number === parseInt(e.target.value)) === -1) {
            alert('지울 수 없습니다.');
        }
        else {
            newSelectedProblemList.splice(newSelectedProblemList.findIndex(elem => elem.problem_number === parseInt(e.target.value)), 1);
            setSelectedProblemList(newSelectedProblemList);
        }
    };

    return (
        <Container>
            <h3 style={{marginTop: "20px"}}>과제 수정</h3>
            <Button style={postAsgButton} onClick={postAssignment}>수정하기</Button>
            <Button variant="secondary" onClick={() => props.history.goBack(`${url}`)} style={goBackButton}>뒤로가기</Button>
            <hr/>
            <Row>
                <Col md="2" sm="12" style={{paddingTop: "8px", textAlign: "center"}}>
                    <h5 style={subTitle}>과제명: </h5>
                </Col>
                <Col md="9" sm="12">
                    <Form.Control type='text' value={assignmentName} onChange={e => setAssignmentName(e.target.value)}/>
                </Col>
            </Row>
            <hr/>

            <Row style={{marginLeft: "15px"}}>
                <Col lg={6} md={12} style={{paddingLeft: "0", marginBottom: "5px",}}>
                    <h6 style={{fontWeight: "bold", marginLeft: "-15px"}}>[제출일]</h6>
                    <Row>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={sYear} onChange={e => {setSYear(e.target.value)}} />
                                <span style={dateText}>년</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={sMonth} onChange={e => {setSMonth(e.target.value)}} />
                                <span style={dateText}>월</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={sDay} onChange={e => {setSDay(e.target.value)}} />
                                <span style={dateText}>일</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={sHour} onChange={e => {setSHour(e.target.value)}} />
                                <span style={dateText}>시</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={sMinute} onChange={e => {setSMinute(e.target.value)}} />
                                <span style={dateText}>분</span>
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>
                <Col lg={6} md={12} style={{paddingLeft: "0"}}>
                    <h6 style={{fontWeight: "bold", marginLeft: "-15px"}}>[마감일]</h6>
                    <Row>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={eYear} onChange={e => {setEYear(e.target.value)}} />
                                <span style={dateText}>년</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={eMonth} onChange={e => {setEMonth(e.target.value)}} />
                                <span style={dateText}>월</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={eDay} onChange={e => {setEDay(e.target.value)}} />
                                <span style={dateText}>일</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={eHour} onChange={e => {setEHour(e.target.value)}} />
                                <span style={dateText}>시</span>
                            </InputGroup>
                        </Col>
                        <Col lg={2} md={4} sm={6} style={dateStyle}>
                            <InputGroup size="sm">
                                <Form.Control type="number" value={eMinute} onChange={e => {setEMinute(e.target.value)}} />
                                <span style={dateText}>분</span>
                            </InputGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>




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
                        <ShowProblems problem_list={searchedProblemList} addProblem={addProblem}/>
                        </tbody>
                    </Table>
                    <div style={{marginBottom: "30px", display: "flex", textAlign: "center"}}>
                        <Form.Control as="select" onChange={changeConstraint} style={{width: "33%"}}>
                            <option value="name">문제 이름</option>
                            <option value="category">알고리즘 분류</option>
                        </Form.Control>
                        <Form.Control value={field} type="text" onChange={changeField} style={{width: "50%", marginLeft: "5px"}}/>
                        <Button onClick={findProblems} variant="outline-primary" style={{marginLeft: "5px"}}>검색</Button>
                    </div>
                </Col>
                <SelectedAssignment selectedProblem={selectedProblemList} removeProblem={removeProblem}/>
            </Row>
        </Container>
    );
}

export default withRouter(ModifyAssignment);