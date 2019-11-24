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
                    axios.get('/class/getAssignmentList');
                }).then( res => {
                //setAsgList(res.data.assignment_list);
                setAsgList([
                    {name: "정렬1", problem_list: [11, 111], start_date: "2019-09-11", end_date: "2019-09-20"},
                    {name: "정렬2", problem_list: [12, 123, 33452], start_date: "2019-07-12", end_date: "2019-08-01"}
                ])
            });
        };
        get_assignment_list();
    }, [cookies, dispatch]);

    const [selectedAsg, setSelectedAsg] = useState([]);
    const assignmentTable = asgList.map((assignment, i) =>
        <tr key={i + 1} onClick={(e) => setSelectedAsg(assignment.problem_list)} style={{cursor: "pointer"}}>
            <th>{i + 1}</th>
            <th>{assignment.name}</th>
            <th>{assignment.start_date}</th>
            <th>{assignment.end_date}</th>
            <th>60%</th>
        </tr>
    )

    const addAsgButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    }

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
                    {selectedAsg.length > 0 &&
                        <AssignmentList problem_list={selectedAsg}/>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default withRouter(StudentInfo);