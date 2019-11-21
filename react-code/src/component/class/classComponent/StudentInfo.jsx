import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Card, Col, Container, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

import {
    useRouteMatch,
    useParams,
    withRouter, Link
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function StudentInfo(props) {

    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    useEffect(() => {
        async function get_student_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);

                })
        };

    }, [cookies, dispatch]);

    const solvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px"
    }

    return (
        <Container>
            <Row>
                <Col lg={6} md={12}>
                    <h3 style={{"margin": "20px 0"}}>과제 목록</h3>
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
                        <tr>
                            <th>#</th>
                            <th>과제명</th>
                            <th>제출일</th>
                            <th>마감일</th>
                            <th>진행도</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>과제1</th>
                            <th>2019.11.21</th>
                            <th>2019.11.29</th>
                            <th>60%</th>
                        </tr>
                        <tr>
                            <th>2</th>
                            <th>과제2</th>
                            <th>2019.11.21</th>
                            <th>2019.11.30</th>
                            <th>20%</th>
                        </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col lg={6} md={12}>
                    <h3 style={{"margin": "20px 0"}}>OOO 님이 해결한 문제</h3>
                    <hr/>
                    <Row>
                        <Col md={6} sm={12}>
                            <Card style={solvedCardStyle}>
                                A+B
                            </Card>
                        </Col>
                        <Col md={6} sm={12}>
                            <Card style={solvedCardStyle}>
                                A-B
                            </Card>
                        </Col>
                        <Col md={6} sm={12}>
                            <Card style={solvedCardStyle}>
                                A*B
                            </Card>
                        </Col>
                        <Col md={6} sm={12}>
                            <Card style={solvedCardStyle}>
                                A/B
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default withRouter(StudentInfo);