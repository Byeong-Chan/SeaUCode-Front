import React, {useEffect, useState } from 'react';
import 'typescript';
import { Button, Form, Col, Row, Card } from 'react-bootstrap';
import axios from "axios";
import config from "../../../config";
import generalFunctions from "../../../generalFunctions";
import {useSelector} from "react-redux";
import { useParams, withRouter} from 'react-router-dom';

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function Chatting(props) {

    const { id } = useParams();
    const [ page, setPage ] = useState(1);

    const chattingSocket = useSelector(
        state => state.chattingSocket
    );

    const token = useSelector(
        state => state.token
    );

    const bodyStyle = {
        margin: "20px",
        overflowY: "auto",
        maxHeight: window.innerHeight - "130"
    };
    const tagStyle = {
        position: "absolute",
        top: "-8px",
        left: "-15px"
    };
    const nameStyle = {
        position: "relative",
        padding: "8px 20px",
        background: "black",
        color: "white",
        borderRadius: "12px"
    };
    const dateStyle = {
        position: "relative",
        top: "5px",
        left: "5px",
        fontSize: "small",
        color: "gray"
    };
    const footerStyle = {
        position: "absolute",
        bottom: "0px",
        width: "100%",
        padding: "0 20px"
    };
    const textareaStyle = {
        width: "100%",
        resize: "none",
        border: "1px solid darkgray",
        borderRadius: "5px"
    };

    useEffect(() => {
        async function get_another_user_chatting() {
            chattingSocket.off();
            chattingSocket.on(id, data => {
                props.setChatting(props.chatting.concat(data));
            })
        };
        get_another_user_chatting();
    }, [props.setChatting, props.chatting]);

    const enterKeyPress = (e) => {
        if(e.key === 'Enter'){
            if (!e.shiftKey){
                e.preventDefault();
                submitChatText();
                setChatText("");
            }
        }
    };

    const [chatText, setChatText] = useState("");

    const chatTextChange = e => {
        setChatText(e.target.value);
    };
    const submitChatText = e => {
        if(chatText !== "") {
            generalFunctions.axiosInit(axios, token);
            axios.post('/class/saveChatting', {id: id, message: chatText}).then(result => {
                chatScroll.scrollTo(0, chatScroll.scrollHeight);
            }).catch(err => {
                alert('전송에 실패하였습니다.');
            })
        }
    };

    const onPageChange = e => {
        generalFunctions.axiosInit(axios, token);
        axios.get(`/class/getChattingList/${page + 1}/${id}`).then(result => {
            if(result.data.chatting_list.length === 0) return;
            const newarr = result.data.chatting_list.concat();
            for(let i = 0; i < props.chatting.length; i++) {
                if(result.data.chatting_list.find(elem => elem.owner === props.chatting[i].owner && elem.send_time === props.chatting[i].send_time && elem.message === props.chatting[i].message) !== undefined)
                    continue;
                newarr.push(props.chatting[i]);
            }
            props.setChatting(newarr);
            setPage(page + 1);
            chatScroll.scrollTo(0, 1500);
        }).catch(err => {
            // 불러올 수 없다.
        });
    };

    const chatTemplate = props.chatting.map((chatLog, idx) =>
        <Card key={`chatting_${idx}`} style={{"margin": "15px 15px 25px 15px"}}>
            <div style={tagStyle}>
                        <span style={nameStyle}>
                            {chatLog.owner}
                        </span>
                <span style={dateStyle}>
                            {(new Date(chatLog.send_time)).toLocaleString()}
                        </span>
            </div>
            <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                {chatLog.message}
            </Card.Body>
        </Card>
    );

    const chatScroll = document.getElementById("chatScroll");
    const listenWheelEvent = (e) => {
        if(chatScroll.scrollTop == 0) {
            onPageChange();
        }
    }

    return (
        <div className="chatting">
            <Row>
                <Col lg={12}>
                    <div id="chatScroll" style={bodyStyle} onScroll={listenWheelEvent}>
                    {chatTemplate}
                    </div>
                </Col>
            </Row>
            <footer style={footerStyle}>
                <textarea style={textareaStyle} value={chatText} onChange={chatTextChange} onKeyPress={enterKeyPress}>
                </textarea>
                <Button type="button" onClick={submitChatText} style={{"display": "none"}}>보내기</Button>
            </footer>
        </div>
    );
}

export default withRouter(Chatting);