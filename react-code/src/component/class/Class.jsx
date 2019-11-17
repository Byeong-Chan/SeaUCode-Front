import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Col, Row, Container, Navbar} from 'react-bootstrap';

import Menu from './classComponent/Menu';

import config from '../../config';
import generalFunctions from '../../generalFunctions';

import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";

const setToken = refresh_token => ({ type: config.SET_TOKEN, refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Class(props) {
    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    const [name, setName] = useState('');
    const [notice, setNotice] = useState([]);
    const [chatting, setChatting] = useState([]);

    useEffect(() => {
        async function get_class_info() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    return axios.get('/class/getClassInfo/' + id);
                }).then(result => {
                    console.log(result.data.notice[0]);
                    setName(result.data.name);
                }).catch(err => {
                    console.log(err);
                    if (err.response === undefined) {
                        alert('서버와 연결이 끊겼습니다.');
                        props.history.push('/');
                    }
                    else if (err.response.data.message === 'not logged in') {
                        alert('로그인이 필요한 서비스입니다.');
                        props.history.push('/');

                        dispatch(setToken(''));
                        dispatch(toggleLoggedIn(false));
                        removeCookies('access_token', {path: '/'});
                    }
                    else if (err.response.data.message === 'auth-fail') {
                        alert('다시 로그인 해주세요!');
                        props.history.push('/');

                        dispatch(setToken(''));
                        dispatch(toggleLoggedIn(false));
                        removeCookies('access_token', {path: '/'});
                    }
                    else if (err.response.data.message === 'not-exist-class') {
                        alert('그런 반은 없습니다.');
                        props.history.push('/');
                    }
                    else {
                        alert('문제가 발생했습니다.');
                        //props.history.push('/');
                    }
            });
        };
        get_class_info();
    }, [cookies, dispatch]);

    return (
        <div className="Class" style={{"height":"100%"}}>

            <Row style={{"height":"100%", paddingLeft: 0, paddingRight: 0 }}>
                <Col sm={2} style={{ paddingLeft: 0, paddingRight: 0, backgroundColor: "#343a40" }}>
                    <Menu className={name} url={url}/>
                </Col>
                <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Switch>
                        <Route path={`${path}/student`}>
                            학생관리
                        </Route>
                        <Route path={`${path}/`}>
                            채팅
                        </Route>
                    </Switch>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(Class);