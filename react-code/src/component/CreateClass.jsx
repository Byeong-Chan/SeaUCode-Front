import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });


function CreateClass() {

    //const [isLogedIn, toggleLogedIn] = useState(false);
    //const [cookies] = useCookies(['access_token']);
    //const dispatch = useDispatch();
    const token = useSelector(
        state => state.token
    );

    return (
        <div className="CreateClass">
            토큰 연결
        </div>
    );
}

export default CreateClass;