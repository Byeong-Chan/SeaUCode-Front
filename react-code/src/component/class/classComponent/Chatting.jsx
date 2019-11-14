import React, { useEffect, useState } from 'react';
import 'typescript';
import { Button, Form, Col, Row } from 'react-bootstrap';

function Chatting() {

    return (
        <div className="chatting">
            <Card>
                <span style="">작성자</span>
                <Card.Body>This is some text within a card body.</Card.Body>
            </Card>
            <Card>
                <Card.Body>This is some text within a card body.</Card.Body>
            </Card>
            <Card>
                <Card.Body>This is some text within a card body.</Card.Body>
            </Card>
        </div>
    );
}

export default Chatting;