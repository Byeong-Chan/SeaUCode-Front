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

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});
const setUserEmail = input_email => ({ type: config.SET_USER_EMAIL, input_email});
const setUserName = input_name => ({ type: config.SET_USER_NAME, input_name});
const setUserNickname = input_nickname => ({ type: config.SET_USER_NICKNAME, input_nickname});

function LoggedInUserTopNav(props) {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

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
            <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>
            <Link to="/myPage"><Button variant="dark">마이페이지</Button></Link>
            <Link to="/problems"><Button variant="dark">문제 목록</Button></Link>
        </div>
    );
}

export default withRouter(LoggedInUserTopNav);