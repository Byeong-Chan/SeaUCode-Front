import React from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function LoggedInUserTopNav() {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    return (
        <div className="LoggedInUserTopNav">
            <Link to="/"><Button onClick={logout} variant="dark">로그아웃</Button></Link>
            <Link to="/createClass"><Button variant="dark">반 만들기</Button></Link>
        </div>
    );
}

export default LoggedInUserTopNav;