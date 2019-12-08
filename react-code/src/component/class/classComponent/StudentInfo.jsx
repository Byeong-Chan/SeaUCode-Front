import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Container, Row, Col, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

import AssignmentList from "../assignmentComponent/AssignmentList";

import {
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function StudentInfo(props) {

    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id, student_id } = useParams();

    const [asgList, setAsgList] = useState([]);

    const [selectedId, setSelectedId] = useState('');

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    useEffect(() => {
        async function get_assignment_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    return axios.get(`/assignment/getAssignmentList/${id}/${student_id}`);
                }).then( res => {
                    const assignment_list = res.data.assignment_list;
                    for(let i = 0; i < assignment_list.length; i++) {
                        assignment_list[i].acc_list = [];
                    }
                    const get_progress = async function(idx) {
                        if(idx === assignment_list.length) return;
                        return axios.get(`/assignment/getAssignmentProgress/${assignment_list[idx]._id}`).then( result => {
                            assignment_list[idx].acc_list = result.data.acc_list;
                            return get_progress(idx + 1);
                        });
                    };
                    const get_judge_link = async function(idx) {
                        if(idx === assignment_list.length) return;
                        return axios.get(`/assignment/getOutJudgeResultLink/${assignment_list[idx]._id}`).then( result => {
                            assignment_list[idx].link_list = result.data.link_list;
                            return get_judge_link(idx + 1);
                        });
                    };

                    get_progress(0).then(() => {
                        return get_judge_link(0);
                    }).then(() => {
                        setAsgList(assignment_list);
                    }).catch(err => {
                        setAsgList(assignment_list);
                        alert('진행도를 불러오는데 실패했습니다..!');
                    });
                }).catch(err => {
                    console.log(err);
                    alert('학생 과제 정보를 불러들이는데 실패했습니다..');
            });
        };
        get_assignment_list();
    }, [cookies, dispatch]);

    const [selectedAsg, setSelectedAsg] = useState([]);
    const [selectedAsgAcc, setSelectedAsgAcc] = useState([]);
    const [selectedAsgLink, setSelectedAsgLink] = useState([]);

    const assignmentTable = asgList.map((assignment, i) =>
        <tr key={i + 1} onClick={(e) => {setSelectedId(assignment._id); setSelectedAsg(assignment.problem_list); setSelectedAsgAcc(assignment.acc_list); setSelectedAsgLink(assignment.link_list); }} style={{cursor: "pointer"}}>
            <th>{i + 1}</th>
            <th>{assignment.name}</th>
            <th>{(new Date(assignment.start_date)).toLocaleString()}</th>
            <th>{(new Date(assignment.end_date)).toLocaleString()}</th>
            <th>{assignment.acc_list.length / assignment.problem_list.length * 100}%</th>
        </tr>
    );

    const addAsgButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    };

    return (
        <Container>
            <Row>
                <Col lg={6} md={12}>
                    <h3 style={{"margin": "20px 0"}}>과제 목록</h3>
                    <Button style={addAsgButton} onClick={() => props.history.push(`${url}` + '/addAssignment')}>새 과제 출제</Button>
                    <hr/>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>과제명</th>
                            <th>제출일</th>
                            <th>마감일</th>
                            <th>진행도</th>
                        </tr>
                        </thead>
                        <tbody>
                            {assignmentTable}
                        </tbody>
                    </Table>
                </Col>
                <Col lg={6} md={12}>
                    {
                        <AssignmentList problem_list={selectedAsg} acc_list={selectedAsgAcc} link_list={selectedAsgLink} nickname={student_id} assignment_id={selectedId} url={url} asgList={asgList} setAsgList={setAsgList}/>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default withRouter(StudentInfo);