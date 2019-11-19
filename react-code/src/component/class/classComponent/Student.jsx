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
        async function get_class_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    console.log("들어옴");
                }).then(

            );
        };
        get_class_list();
    }, [cookies, dispatch]);

    const classrooms = [
        {_id: 4, name: "임시반1111"},
        {_id: 5, name: "임시반12423"}
    ]
    const tableTemplate = classrooms.map((classroom) =>
        <tr key={classroom._id}>
            <td>{classroom._id}</td>
            <td><Link to={'class/' + classroom._id}>{classroom.name}</Link></td>
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
                <tr>
                    <td>1</td>
                    <td>씨유코드 고급반 11111</td>
                    <td>8</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>씨유코드 중급반 12345</td>
                    <td>12</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>씨유코드 초급반 43452</td>
                    <td>12</td>
                </tr>
                {tableTemplate}
                </tbody>
            </Table>
        </div>
    );
}

export default withRouter(Student);