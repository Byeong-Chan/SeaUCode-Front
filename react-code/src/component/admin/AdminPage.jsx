import React, { useEffect, useState } from 'react';
import 'typescript';

import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import axios from 'axios';
import {Col, Row, Container, Navbar} from 'react-bootstrap';
import ProblemAdd from './ProblemAdd';
import AdminProblemList from "./AdminProblemList";
import ProblemModify from './ProblemModify';

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

function AdminPage(props) {
    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    useEffect(() => {
        async function isAdmin() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    return axios.get('/loggedIn');
                }).then(response => {
                    if(response.data.role !== 3) {
                        alert('admin 만 접근 가능한 페이지입니다.');
                        props.history.push('/');
                    }
                }).catch(err => {
                    if (err.response === undefined) {
                        alert('서버와 연결이 끊겼습니다.');
                        props.history.push('/');
                    }
                    else if (err.response.data.message === 'not logged in') {
                        alert('로그인이 필요한 서비스입니다.');
                        dispatch(setToken(''));
                        dispatch(toggleLoggedIn(false));
                        removeCookies('access_token', {path: '/'});
                        props.history.push('/');
                    }
                    else if (err.response.data.message === 'auth-fail') {
                        alert('다시 로그인 해주세요!');
                        dispatch(setToken(''));
                        dispatch(toggleLoggedIn(false));
                        removeCookies('access_token', {path: '/'});
                        props.history.push('/');
                    }
                    else {
                        alert('문제가 발생했습니다.');
                        //props.history.push('/');
                    }
            });
        };
        isAdmin();
    }, [cookies, dispatch, props.history, removeCookies]);

    return (
        <div className="AdminPage" style={{"height":"100%"}}>
            <Switch>
                <Route path={path + '/modifyProblem/:id'}>
                    <ProblemModify />
                </Route>
                <Route path={path + '/addProblem'}>
                    <ProblemAdd />
                </Route>
                <Route path={path}>
                    <AdminProblemList />
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(AdminPage);