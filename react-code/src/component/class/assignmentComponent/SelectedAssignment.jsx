import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Col, Container, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";
import {useParams, useRouteMatch, withRouter} from "react-router";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function SelectedAssignment(props) {

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

    const [selectedProblemList, setSelectedProblemList] = useState([]);

    useEffect(() => {
        async function get_problem_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    setSelectedProblemList(props.selectedProblem);
            });
        };
        get_problem_list();
    }, [cookies, dispatch]);

    const tableTemplate = selectedProblemList.map((problem, i) =>
        <tr key={i + 1}>
            <th>{problem[0]}</th>
            <th>{problem[1]}</th>
            <th>{problem[2]}</th>
            <th>
                <Button variant="danger" size="sm">
                    제거
                </Button>
            </th>
        </tr>
    )

    return (
        <Col lg={6} md={12}>
            <h6 style={{fontWeight: "bold"}}>[선택된 문제]</h6>
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
                    {tableTemplate}
                </tbody>
            </Table>
        </Col>
    );
}

export default withRouter(SelectedAssignment);