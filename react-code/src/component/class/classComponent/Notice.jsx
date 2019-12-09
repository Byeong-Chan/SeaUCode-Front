import React, { useEffect, useState } from 'react';
import 'typescript';
import { useCookies } from 'react-cookie';
import { Card, Modal } from 'react-bootstrap';
import axios from 'axios';
import config from '../../../config';
import generalFunctions from "../../../generalFunctions";

function Notice(props) {

    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const bodyStyle = {
        overflowY: "auto",
        maxHeight: window.innerHeight - "150"
    };
    const tagStyle = {
        position: "absolute",
        top: "-8px"
    };
    const dateStyle = {
        position: "relative",
        top: "5px",
        left: "5px",
        fontSize: "small",
        color: "gray"
    };

    const noticeTemplate = (
        <Card style={{"margin": "15px 15px 25px 15px"}}>
            <div style={tagStyle}>
                <span style={dateStyle}>
                    날짜
                </span>
            </div>
            <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                내용
            </Card.Body>
        </Card>
    );

    const cardNotice = props.noticeList.map(item => {
        return (
            <Card style={{"margin": "15px 15px 25px 15px"}}>
                <div style={tagStyle}>
                    <span style={dateStyle}>
                        {(new Date(item.send_date)).toLocaleString()}
                    </span>
                </div>
                <Card.Body style={{"padding": "2rem 1rem 1rem 1rem"}}>
                    {item.content}
                </Card.Body>
            </Card>
        );
    });

    return (
        <Modal
            {...props}
            dialogClassName="noticeModal">
            <Modal.Header closeButton>
                <Modal.Title>공지</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="chatScroll" style={bodyStyle}>
                    {cardNotice}
                </div>
            </Modal.Body>
        </Modal>
    )

}

export default Notice;