import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Card, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

import {
    useRouteMatch,
    useParams,
    withRouter, Link
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Student(props) {

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

    useEffect(() => {
        async function get_student_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    axios.get('/class/getStudentList')
                })
        };
        get_student_list();
    }, [cookies, dispatch]);

    const students = [
        {_id: 1, name: "학생"},
        {_id: 2, name: "학생2"}
    ]
    const tableTemplate = students.map((student) =>
        <tr key={student._id}>
            <td>{student._id}</td>
            <td><Link to={'studentInfo/' + student._id}>{student.name}</Link></td>
        </tr>
    )

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>닉네임</th>
                </tr>
                </thead>
                <tbody>
                    {tableTemplate}
                </tbody>
            </Table>
        </div>
    );
}

export default withRouter(Student);