import React, {useEffect, useState} from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {ListGroup} from 'react-bootstrap'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function Menu(props) {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    return (
        <ListGroup style={{textAlign: "center"}}>
            <Link to={`${props.url}`}>
                <ListGroup.Item variant="secondary">
                    <b>{props.className}</b>
                </ListGroup.Item>
            </Link>

            <Link to={`${props.url}/student`}>
            <ListGroup.Item action variant="secondary">
                학생 관리
            </ListGroup.Item>
            </Link>
            <ListGroup.Item action variant="secondary">
                학생 관리
            </ListGroup.Item>
        </ListGroup>
    );
}

export default Menu;