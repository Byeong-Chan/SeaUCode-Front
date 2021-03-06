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

    const selectedProblemList = props.selectedProblem;


    const tableTemplate = selectedProblemList.map((problem, i) =>
        <tr key={i + 1}>
            <th>{problem.problem_number}</th>
            <th>{problem.name}</th>
            <th>{problem.Category.map((item, i) => i + 1 < problem.Category.length ? `${item}, ` : `${item}`)}</th>
            <th>
                <Button variant="danger" size="sm" value={problem.problem_number} onClick={props.removeProblem}>
                    제거
                </Button>
            </th>
        </tr>
    );

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