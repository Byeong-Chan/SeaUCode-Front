import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});
const setUserNickname = input_nickname => ({ type: config.SET_USER_NICKNAME, input_nickname});

function ClassList() {

    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);
    const dispatch = useDispatch();

    const userNickname = useSelector(
        state => state.userNickname
    );

    axios.get('/classList/classroom_master?=userNickname')
        .then( response => { console.log(response); } ) // SUCCESS

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
                </tbody>
            </Table>
        </div>
    );
}

export default ClassList;