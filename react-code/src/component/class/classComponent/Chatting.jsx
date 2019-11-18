import React, { useEffect, useState } from 'react';
import 'typescript';
import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import axios from "axios";
import config from "../../../config";
import generalFunctions from "../../../generalFunctions";
import {useSelector} from "react-redux";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Chatting() {

    const token = useSelector(
        state => state.token
    );

    const bodyStyle = {
        margin: "20px",
        overflowY: "auto",
        maxHeight: window.innerHeight - "130"
    }
    const tagStyle = {
        position: "absolute",
        top: "-8px",
        left: "-15px"
    }
    const nameStyle = {
        position: "relative",
        padding: "8px 20px",
        background: "black",
        color: "white",
        borderRadius: "12px"
    }
    const dateStyle = {
        position: "relative",
        top: "5px",
        left: "5px",
        fontSize: "small",
        color: "gray"
    }
    const footerStyle = {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        padding: "0 20px"
    }
    const textareaStyle = {
        width: "100%",
        resize: "none",
        border: "1px solid darkgray",
        borderRadius: "5px"
    }

    const enterKeyPress = (e) => {
        if(e.key == 'Enter'){
            if (!e.shiftKey){
                e.preventDefault();
                submitChatText();
                setChatText("");
            }
        }
    }

    const [chatText, setChatText] = useState("");
    const chatTextChange = e => {
        setChatText(e.target.value);
    };
    const submitChatText = e => {
        if(chatText != "") {
            generalFunctions.axiosInit(axios, token);
            axios.post('/class/submitChatting', {message: chatText})
        }
    }

    const chatLogs = [
        {_id: 1, send_time: "2019-11-14 20:49", message: 'soddsfs', owner: "학생"},
        {_id: 2, send_time: "2019-11-14 20:50", message: 'blablabla', owner: "선생님"}
    ]
    const chatTemplate = chatLogs.map((chatLog) =>
        <Card style={{"margin": "15px 15px 25px 15px"}}>
            <div style={tagStyle}>
                        <span style={nameStyle}>
                            {chatLog.owner}
                        </span>
                <span style={dateStyle}>
                            {chatLog.send_time}
                        </span>
            </div>
            <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                {chatLog.message}
            </Card.Body>
        </Card>
    )

    return (
        <div className="chatting">
            <body style={bodyStyle}>
            {chatTemplate}
            </body>
            <footer style={footerStyle}>
                <textarea style={textareaStyle} value={chatText} onChange={chatTextChange} onKeyPress={enterKeyPress}>
                </textarea>
                <Button type="button" onClick={submitChatText} style={{"display": "none"}}>보내기</Button>
            </footer>
        </div>
    );
}

export default Chatting;