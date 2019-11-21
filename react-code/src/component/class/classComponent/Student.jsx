import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Form, Modal, Table} from 'react-bootstrap';
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
        async function get_student_list() {
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .then( res => {
                    generalFunctions.axiosInit(axios, res.refresh_token);
                    axios.get('/class/getStudentList')
                })
        };
        get_student_list();
    }, [cookies, dispatch]);

    const students = [
        {_id: 1, name: "학생"},
        {_id: 2, name: "학생2"}
    ]
    const tableTemplate = students.map((student) =>
        <tr key={student._id}>
            <td>1</td>
            <td><Link to={'studentInfo/' + student._id}>{student.name}</Link></td>
            <td><Button variant="danger" size="sm" onClick={postDelStudent}>탈퇴</Button></td>
        </tr>
    )

    const [showAddStudent, setShowAddStudent] = useState(false);
    const handleCloseAddStudent = () => setShowAddStudent(false);
    const handleShowAddStudent = () => setShowAddStudent(true);

    const [ addNickname, setAddNickname ] = useState('');
    const changeAddNickname = e => {
        setAddNickname(e.target.value);
    };

    const postAddStudent = e => {
        generalFunctions.axiosInit(axios, token);
        console.log(addNickname);
        axios.post('/class/addStudent', {nickname: addNickname});
    };

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>닉네임</th>
                    <th><Button size="sm" onClick={handleShowAddStudent}>새 학생 추가</Button></th>
                </tr>
                </thead>
                <tbody>
                    {tableTemplate}
                </tbody>
            </Table>

            <Modal show={showAddStudent} onHide={handleCloseAddStudent}>
                <Modal.Header closeButton>
                    <Modal.Title>새 학생 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body><input type="text" value={addNickname} placeholder="추가할 학생의 닉네임 입력" onChange={changeAddNickname} style={{"width": "100%"}}/></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddStudent}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={postAddStudent}>
                        추가하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default withRouter(Student);