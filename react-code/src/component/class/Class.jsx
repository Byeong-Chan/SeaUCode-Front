import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

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

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Class(props) {
    const dispatch = useDispatch();
    const [cookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    useEffect(() => {
        async function get_class_info() {
            generalFunctions.isTokenExist(isLoggedIn, cookies, dispatch, toggleLoggedIn, setToken);
            generalFunctions.axiosInit(axios, token, config);
            axios.get('/class/getClassInfo/' + id).then(result=> {

            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊겼습니다.');
                    this.props.history.push('/');
                }
                else if(err.response.data.message === 'not logged in') {
                    alert('로그인이 필요한 서비스입니다.');
                    props.history.push('/');

                    dispatch(setToken(''));
                    dispatch(toggleLoggedIn(false));
                }
                else if(err.response.data.message === 'auth-fail') {
                    alert('다시 로그인 해주세요!');
                    props.history.push('/');

                    dispatch(setToken(''));
                    dispatch(toggleLoggedIn(false));
                }
                else {
                    alert('문제가 발생했습니다.');
                    props.history.push('/');
                }
            });
        };
        get_class_info();
    }, [cookies, dispatch]);

    return (
        <div className="Class">
        </div>
    );
}

export default withRouter(Class);