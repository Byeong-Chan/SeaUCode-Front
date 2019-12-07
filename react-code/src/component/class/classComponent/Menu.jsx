import React, {useEffect, useState} from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {ListGroup} from 'react-bootstrap'

import Notice from "./Notice";

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

    const [noticeModalShow, setNoticeModalShow] = useState(false);

    return (
        <ListGroup style={{textAlign: "center"}}>
            <Link to={`${props.url}`}>
                <ListGroup.Item variant="secondary">
                    <b>{props.className}</b>
                </ListGroup.Item>
            </Link>
            {
                props.isTeacher ?
                <Link to={`${props.url}/student`}>
                    <ListGroup.Item action variant="secondary">
                        <b>학생 관리</b>
                    </ListGroup.Item>
                </Link>
                    :
                <Link to={`${props.url}/myAssignment`}>
                    <ListGroup.Item action variant="secondary">
                        내 과제 보기
                    </ListGroup.Item>
                </Link>
            }
            <ListGroup.Item variant="secondary" onClick={() => setNoticeModalShow(true)} style={{cursor: "pointer"}}>
                <b>공지</b>
            </ListGroup.Item>
            <Notice
                show={noticeModalShow}
                onHide={() => setNoticeModalShow(false)}
            />
        </ListGroup>
    );
}

export default Menu;