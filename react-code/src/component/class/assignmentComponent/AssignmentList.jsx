import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Col, Container, Row, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";
import {useParams, useRouteMatch, withRouter, Link} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function AssignmentList(props) {

    const userNickname = useSelector(
        state => state.userNickname
    );

    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const problemList = props.problem_list;
    const accList = props.acc_list;
    const linkList = props.link_list;

    const unsolvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px",
        cursor: "pointer",
        background: "lightgray",
        color: "black"
    };
    const solvedCardStyle = {
        margin: "5px 0 0 0",
        padding: "10px",
        cursor: "pointer",
        background: "#00ACEE",
        color: "white"
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

    const toModify = e => {
        if(props.assignment_id === '') alert('과제를 선택해주세요!');
        else props.history.push(`${props.url}/modifyAssignment/${props.assignment_id}`);
    };

    const toDelete = e => {
        if(props.assignment_id === '') alert('과제를 선택해주세요!');
        else {
            const answer = window.confirm('정말로 삭제하시겠습니까?');
            if(answer) {
                generalFunctions.axiosInit(axios, cookies.access_token);
                axios.delete(`/problems/deleteAssignment/${props.assignment_id}`).then(result=> {
                    alert('삭제에 성공하였습니다!');
                    const newArr = props.asgList.concat();
                    newArr.splice(newArr.findIndex(elem => elem._id === props.assignment_id), 1);
                    props.setAsgList(newArr);
                }).catch(err => {
                    alert('삭제에 실패하였습니다!');
                })
            }
        }
    };

    const problemCard = problemList.map((problem, i) => {
        if (problem.split('/')[0] === 'SeaUCode') {
            const tmp = accList.find(e => e === problem) === undefined ?
                `/problems/${problem.split('/')[1]}` :
                `/studentJudges/${props.nickname}/${problem.split('/')[1]}`;
            return (
                <Col sm={6} key={`assignment_problem_${i + 1}`}>
                    <Link to={tmp}>
                        <Card
                            style={accList.find(e => e === problem) === undefined ? unsolvedCardStyle : solvedCardStyle}>
                            {problem}
                        </Card>
                    </Link>
                </Col>
            );
        }
        else {
            const tmp = linkList.find(elem => elem.problem_number === problem);
            if(tmp === undefined) {
                let outerUrl = "";
                if(problem.split('/')[0] === 'codeforces') {
                    outerUrl = "https://codeforces.com/problemset/problem/"
                    for(let i = 10; i < problem.length; i++) {
                        if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(problem[i]) !== -1) {
                            outerUrl = outerUrl + '/';
                        }
                        outerUrl = outerUrl + problem[i];
                    }
                }
                else if(problem.split('/')[0] === 'boj') {
                    outerUrl = `https://acmicpc.net/problem/${problem.split('/')[1]}`;
                }
                else {
                    outerUrl = `https://spoj.com/problems/${problem.split('/')[1]}`;
                }
                return (
                    <Col sm={6} key={`assignment_problem_${i + 1}`}>
                        <a href={outerUrl}>
                            <Card
                                style={accList.find(e => e === problem) === undefined ? unsolvedCardStyle : solvedCardStyle}>
                                {problem}
                            </Card>
                        </a>
                    </Col>
                );
            }
            return (
                <Col sm={6} key={`assignment_problem_${i + 1}`}>
                    <a href={tmp.pending_link}>
                        <Card
                            style={accList.find(e => e === problem) === undefined ? unsolvedCardStyle : solvedCardStyle}>
                            {problem}
                        </Card>
                    </a>
                </Col>
            );
        }
    });

    return (
        <div>
            <h3 style={{"margin": "20px 0"}}>선택된 과제 진행상태</h3>
            <Button variant="danger" style={updateAsgButton} onClick={toModify}>수정</Button>
            <Button variant="secondary" style={deleteAsgButton} onClick={toDelete}>삭제</Button>
            <hr/>
            <Row>
                {problemCard}
            </Row>
        </div>
    );
}

export default withRouter(AssignmentList);