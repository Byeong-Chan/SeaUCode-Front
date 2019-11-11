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
    useParams
} from "react-router-dom";
import config from "../config";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function LoggedInUserTopNav() {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(toggleLoggedIn(false));
        dispatch(clearToken());
        removeCookie('access_token', { path: '/' });
    };

    return (
        <div className="LoggedInUserTopNav">
            <Link to="/"><Button onClick={logout} variant="dark">로그아웃</Button></Link>
            <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>
            <Link to="/myPage"><Button variant="dark">마이페이지</Button></Link>
        </div>
    );
}

export default LoggedInUserTopNav;