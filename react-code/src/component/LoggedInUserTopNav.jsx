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
import LoginForm from "./LoginForm";
import axios from "axios";
import CreateClass from "./CreateClass";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function LoggedInUserTopNav() {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    return (
        <div className="LoginedUserTopNav">
            <Link to="/"><Button onClick={logout} variant="dark">로그아웃</Button></Link>
            <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>
            <Button variant="dark">마이페이지</Button>
        </div>
    );
}

export default LoggedInUserTopNav;