import React, {useEffect, useState} from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, ButtonToolbar, Nav, Navbar, Modal, Form, Row, Col} from 'react-bootstrap'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";
import config from "../config";
import generalFunctions from "../generalFunctions";
import axios from "axios";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});
const setUserEmail = input_email => ({ type: config.SET_USER_EMAIL, input_email});
const setUserName = input_name => ({ type: config.SET_USER_NAME, input_name});
const setUserNickname = input_nickname => ({ type: config.SET_USER_NICKNAME, input_nickname});

function LoggedInUserTopNav(props) {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isStudent, setIsStudent] = useState(false);

    useEffect(() => {
        async function isAdmin() {
            generalFunctions.axiosInit(axios, Cookie.access_token);
            return axios.get('/loggedIn').then(response => {
                if(response.data.role === 3) {
                    setIsAdmin(true);
                    setIsStudent(false);
                    props.setIsTeacher(false);
                }
                else if(response.data.role === 2) {
                    setIsAdmin(false);
                    setIsStudent(true);
                    props.setIsTeacher(false);
                }
                else if(response.data.role === 1) {
                    setIsAdmin(false);
                    setIsStudent(false);
                    props.setIsTeacher(true);
                }
            }).catch(err => {
                props.setIsTeacher(false);
                setIsStudent(false);
                setIsAdmin(false);
            });
        };
        isAdmin();
    }, [Cookie, dispatch]);

    const logout = e => {
        dispatch(toggleLoggedIn(false));
        dispatch(clearToken());
        dispatch(setUserEmail(''));
        dispatch(setUserName(''));
        dispatch(setUserNickname(''));
        removeCookie('access_token', { path: '/' });
        props.history.push('/');
    };

    return (
        <div className="LoggedInUserTopNav">
            <Link to="/"><Button onClick={logout} variant="dark">로그아웃</Button></Link>
            {isStudent ? null : <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>}
            <Link to="/class"><Button variant="dark">반 목록</Button></Link>
            <Link to="/myPage"><Button variant="dark">마이페이지</Button></Link>
            <Link to="/problems"><Button variant="dark">문제 목록</Button></Link>
            {isAdmin ? <Link to="/admin"><Button variant="dark">관리자 페이지</Button></Link> : null}
        </div>
    );
}

export default withRouter(LoggedInUserTopNav);