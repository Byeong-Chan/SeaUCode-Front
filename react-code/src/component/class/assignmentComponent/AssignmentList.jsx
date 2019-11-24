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

function AssignmentList(props) {

    const userNickname = useSelector(
        state => state.userNickname
    );

    const problemList = props.problem_list;

    const solvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px",
        cursor: "pointer"
    }
    const updateAsgButton = {
        position: "absolute",
        top: "20px",
        right: "80px"
    }
    const deleteAsgButton = {
        position: "absolute",
        top: "20px",
        right: "15px"
    }

    const problemCard = problemList.map((problem, i) =>
        <Col md={6} sm={12} key={i + 1}>
            <Card style={solvedCardStyle}>
                {problem}
            </Card>
        </Col>
    )

    return (
        <div>
            <h3 style={{"margin": "20px 0"}}>선택된 과제 진행상태</h3>
            <Button variant="danger" style={updateAsgButton}>수정</Button>
            <Button variant="secondary" style={deleteAsgButton}>삭제</Button>
            <hr/>
            <Row>
                {problemCard}
            </Row>
        </div>
    );
}

export default withRouter(AssignmentList);