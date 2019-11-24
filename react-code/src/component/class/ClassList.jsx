import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';
import generalFunctions from "../../generalFunctions";

import {
    useRouteMatch,
    useParams,
    withRouter, Link
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function ClassList(props) {

    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const [classList, setClassList] = useState([]);

    const token = useSelector(
        state => state.token
    );
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    useEffect(() => {
        async function get_class_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    return axios.get('/class/getClassList');
                }).then( res => {
                    setClassList(res.data.class_list);
            }).catch(err => {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.');
                    props.history.push('/');
                }
                else if(err.response.data.message === 'auth-fail') {
                    alert('다시 로그인 해주세요.');
                    removeCookies('access_token', {path : '/'});
                    dispatch(setToken(''));
                    dispatch(toggleLoggedIn(false));
                    props.history.push('/');
                }
            });
        }
        get_class_list();
    }, [cookies, dispatch]);

    const tableTemplate = classList.map((classroom, i) =>
        <tr key={`classroom_${i + 1}`}>
            <td>{i + 1}</td>
            <td><Link to={'class/' + classroom._id}>{classroom.name}</Link></td>
            <td>{classroom.user_list.length}</td>
        </tr>
    )

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>반 이름</th>
                    <th>인원 수</th>
                </tr>
                </thead>
                <tbody>
                    {tableTemplate}
                </tbody>
            </Table>
        </div>
    );
}

export default withRouter(ClassList);