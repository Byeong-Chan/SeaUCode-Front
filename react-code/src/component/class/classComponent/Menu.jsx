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
import generalFunctions from "../../../generalFunctions";
import axios from "axios";

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function Menu(props) {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    const [noticeModalShow, setNoticeModalShow] = useState(false);
    const [noticeList, setNoticeList] = useState([]);

    const onNoticeShow = e => {
        setNoticeModalShow(true);
        generalFunctions.axiosInit(axios, Cookie.access_token);
        axios.get(`/class/getNoticeList/${props.id}`).then(result => {
            setNoticeList(result.data.notice_list);
        }).catch(err => {
            alert('공지를 불러들이는데 실패하였습니다.');
        });
    };

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
                        <b>내 과제 보기</b>
                    </ListGroup.Item>
                </Link>
            }
            <ListGroup.Item variant="secondary" onClick={onNoticeShow} style={{cursor: "pointer"}}>
                <b>공지</b>
            </ListGroup.Item>
            <Notice
                id={props.id}
                noticeList={noticeList}
                show={noticeModalShow}
                onHide={() => setNoticeModalShow(false)}
            />
        </ListGroup>
    );
}

export default Menu;