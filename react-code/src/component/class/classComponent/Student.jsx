import React, { useEffect, useState } from 'react';
import 'typescript';
import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import {Button, Modal, Table, Form} from 'react-bootstrap';
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

    const [userList, setUserList] = useState([]);

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
                    return axios.get('/class/getClassUserlist/' + id);
                }).then( res => {
                    setUserList(res.data);
                }).catch(err => {
                    if(err.response === undefined) {
                        alert('서버와 연결할 수 없습니다.');
                    }
                    else {
                        alert('사용할 수 없습니다.');
                    }
            });
        };
        get_student_list();
    }, [cookies, dispatch]);

    const [showAddStudent, setShowAddStudent] = useState(false);
    const handleCloseAddStudent = () => setShowAddStudent(false);
    const handleShowAddStudent = () => setShowAddStudent(true);

    const [ addNickname, setAddNickname ] = useState('');
    const changeAddNickname = e => {
        setAddNickname(e.target.value);
    };

    const postAddStudent = e => {
        generalFunctions.axiosInit(axios, token);
        axios.post('/class/addStudentToClass', {
            _id: id,
            nickname: addNickname
        }).then(res => {
            axios.get('/class/getClassUserlist/' + id).then(result => {
                setUserList(result.data);
            });
            alert('추가 되었습니다.');
        }).catch(err => {
            alert('추가에 실패했습니다.');
        });
    };

    const postDelStudent = e => {
        const answer = window.confirm(`이 학생을 정말로 삭제하시겠습니까?`);
        if(answer) {
            generalFunctions.axiosInit(axios, token);

            const delNickname = e.target.value;
            axios.post('/class/deleteStudentInClass/', {
                _id: id,
                nickname: delNickname
            }).then(res => {
                axios.get('/class/getClassUserlist/' + id).then(result => {
                    setUserList(result.data);
                });
                alert('삭제 되었습니다.');
            }).catch(err => {
                alert('삭제에 실패했습니다.');
            });
        }
    };

    const tableTemplate = userList.map((student, i) =>
        <tr key={`student_${i + 1}`}>
            <td>{i + 1}</td>
            <td><Link to={`student/${student.nickname}`}>{student.name}</Link></td>
            <td><Button value={student.nickname} onClick={postDelStudent} variant="danger" size="sm">제거</Button></td>
        </tr>
    );

    return (
        <div>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>이름</th>
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
                <Modal.Body><Form.Control type="text" value={addNickname} placeholder="추가할 학생의 닉네임 입력" onChange={changeAddNickname} style={{"width": "100%"}}/></Modal.Body>
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