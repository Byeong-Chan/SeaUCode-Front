import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Modal} from 'react-bootstrap';
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

function Notice(props) {

    const bodyStyle = {
        overflowY: "auto",
        maxHeight: window.innerHeight - "150"
    };
    const tagStyle = {
        position: "absolute",
        top: "-8px"
    };
    const dateStyle = {
        position: "relative",
        top: "5px",
        left: "5px",
        fontSize: "small",
        color: "gray"
    };

    const noticeTemplate = (
        <Card style={{"margin": "15px 15px 25px 15px"}}>
            <div style={tagStyle}>
                            <span style={dateStyle}>
                            날짜
                        </span>
            </div>
            <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                내용
            </Card.Body>
        </Card>
    );

    return (
        <Modal
            {...props}
            dialogClassName="noticeModal">
            <Modal.Header closeButton>
                <Modal.Title>공지</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="chatScroll" style={bodyStyle}>
                    <Card style={{"margin": "15px 15px 25px 15px"}}>
                        <div style={tagStyle}>
                            <span style={dateStyle}>
                            2019-12-07 12:00
                        </span>
                        </div>
                        <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                            공지 내용
                        </Card.Body>
                    </Card>
                    <Card style={{"margin": "15px 15px 25px 15px"}}>
                        <div style={tagStyle}>
                            <span style={dateStyle}>
                            2019-12-07 12:00
                        </span>
                        </div>
                        <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                            최근 내용이
                        </Card.Body>
                    </Card>
                    <Card style={{"margin": "15px 15px 25px 15px"}}>
                        <div style={tagStyle}>
                            <span style={dateStyle}>
                            2019-12-07 12:00
                        </span>
                        </div>
                        <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                            가장 위에 오도록
                        </Card.Body>
                    </Card>
                </div>
            </Modal.Body>
        </Modal>
    )

}

export default withRouter(Notice);