import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

import config from '../../config';

import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Class() {
    const dispatch = useDispatch();
    const [cookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const token = useSelector(
        state => state.token
    );

    return (
        <div className="Class">
            이것은 반
            <br/>
            {path}, {url}
            <br/>
            {id}
        </div>
    );
}

export default Class;