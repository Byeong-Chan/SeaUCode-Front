import React, {useState} from 'react';
import 'typescript';
import axios from 'axios';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';
import config from '../config';

function RegisterForm(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("1");
    const [nickname, setNickname] = useState("");
    const [bojID, setBojID] = useState("");
    const [codeforcesID, setCodeforcesID] = useState("");
    const [spojID, setSpojID] = useState("");

    const emailChange = e => {
        setEmail(e.target.value);
    };
    const passwordChange = e => {
        setPassword(e.target.value);
    };
    const confirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
    };
    const roleChange = e => {
        setRole(e.target.value);
    };
    const nameChange = e => {
        setName(e.target.value);
    };
    const nicknameChange = e => {
        setNickname(e.target.value);
    };
    const bojIDChange = e => {
        setBojID(e.target.value);
    };
    const codeforcesIDChange = e => {
        setCodeforcesID(e.target.value);
    };
    const spojIDChange = e => {
        setSpojID(e.target.value);
    };

    const postRegist = e => {
        new Promise((resolve, reject) => {
            if (confirmPassword !== password) {
                reject('password-different');
            }
            else {
                axios.defaults.baseURL = config.serverURL;
                resolve(axios.post('/register',
                    {email: email, name: name, password: password, role: parseInt(role), nickname: nickname, boj_id: bojID, codeforces_id: codeforcesID, spoj_id: spojID}));
            }
        }).then(response => {
            //TODO: 회원가입 성공 메시지를 띄우세요. 
            console.log(response);
        }).catch(err => {
            if (err === 'password-different') {
                alert('비밀번호와 확인 비밀번호가 다릅니다.');
            }
            else {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.');
                }
                else if(err.response.data.message === "email-form-error") {
                    alert('제대로 된 이메일을 써주세요.');
                }
                else if(err.response.data.message === "already-register") {
                    alert('이미 등록되어있습니다.');
                }
                else if(err.response.data.message === "password-error") {
                    alert('password 규칙을 확인해주세요.');
                }
                else if(err.response.data.message === 'not-unique-nickname') {
                    alert('동일한 별명이 이미 존재합니다!');
                }
                else {
                    alert('서버에 문제가 있습니다.');
                }
            }
        });
        props.onHide();
    };

    return (
        <Modal
            {...props}
            centered
            className="RegisterForm"
            dialogClassName="registerModal">
            <Modal.Body>
                <Row>
                    <Col md="6" sm="12">
                        <Form>
                            <Form.Group as={Row} controlId="formHorizontalNickName">
                                <Form.Label column sm={4}>
                                    별명*
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="your Nickname" value={nickname} onChange={nicknameChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalEmail">
                                <Form.Label column sm={4}>
                                    이메일*
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="email" placeholder="example@email.com" value={email} onChange={emailChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalPassword">
                                <Form.Label column sm={4}>
                                    비밀번호*
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="password" placeholder="password" value={password} onChange={passwordChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalPasswordConfirm">
                                <Form.Label column sm={4}>
                                    비밀번호 확인*
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="password" placeholder="password again" value={confirmPassword} onChange={confirmPasswordChange} />
                                </Col>
                            </Form.Group>

                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column sm={4}>
                                        선생님/학생*
                                    </Form.Label>
                                    <Col sm={8}>
                                        <Form.Check
                                            type="radio"
                                            label="선생님"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            value="1"
                                            onChange={roleChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="학생"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                            value="2"
                                            onChange={roleChange}
                                        />
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form>
                    </Col>
                    <Col md="6" sm="12">
                        <Form>
                            <Form.Group as={Row} controlId="formHorizontalNickName">
                                <Form.Label column sm={4}>
                                    이름*
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="your Name" value={name} onChange={nameChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalNickName">
                                <Form.Label column sm={4}>
                                    백준 ID
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="Baekjoon ID" value={bojID} onChange={bojIDChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalNickName">
                                <Form.Label column sm={4}>
                                    코드포스 Handle
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="Codeforces Handle" value={codeforcesID} onChange={codeforcesIDChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formHorizontalNickName">
                                <Form.Label column sm={4}>
                                    SPOJ ID
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" placeholder="SPOJ ID" value={spojID} onChange={spojIDChange}/>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col sm="12">
                                    <Button type="button" onClick={postRegist} variant="dark">회원 가입</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    );
}

export default RegisterForm;
