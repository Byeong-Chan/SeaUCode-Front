import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Col, Row } from 'react-bootstrap';

import config from '../config';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});


function MyPage() {
    const dispatch = useDispatch();
    const [cookies] = useCookies(['access_token']);

    const token = useSelector(
        state => state.token
    );

    return (
        <div className="MyPage">
            hello mypage
        </div>
    );
}

export default MyPage;