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
                //setClassList([res.data.class_list]);
                setClassList([11, 111]);
            });
        };
        get_class_list();
    }, [cookies, dispatch]);

    const tableTemplate = classList.map((classroom, i) =>
        <tr key={i + 1}>
            <td>{i + 1}</td>
            <td><Link to={'class/' + '5dd370ecb0b4863e08e6f63b'}>{classroom}</Link></td>
            <td>12</td>
        </tr>
    )

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>반 이름</th>
                    <th>학생 수</th>
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