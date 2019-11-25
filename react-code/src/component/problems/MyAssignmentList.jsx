import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Col, Container, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import generalFunctions from "../../generalFunctions";
import {useParams, useRouteMatch, withRouter, Link} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function MyAssignmentList(props) {

    const userNickname = useSelector(
        state => state.userNickname
    );

    const problemList = props.problem_list;
    const accList = props.acc_list;

    const unsolvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px",
        cursor: "pointer",
        background: "gray"
    };
    const solvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px",
        cursor: "pointer",
        background: "green"
    };
    const updateAsgButton = {
        position: "absolute",
        top: "20px",
        right: "80px"
    };
    const deleteAsgButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    };

    const problemCard = problemList.map((problem, i) =>
        <Row sm={12} key={`assignment_problem_${i + 1}`}>
            <Link to={`/problems/${problem}`}>
                <Card style={accList.find(e => e === problem) === undefined ? unsolvedCardStyle : solvedCardStyle}>
                    {problem}
                </Card>
            </Link>
        </Row>
    );

    return (
        <div>
            <h3 style={{"margin": "20px 0"}}>선택된 과제 진행상태</h3>
            <hr/>
            {problemCard}
        </div>
    );
}

export default withRouter(MyAssignmentList);