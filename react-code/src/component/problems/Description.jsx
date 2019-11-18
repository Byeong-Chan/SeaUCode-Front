import React, { useState, useEffect } from 'react';
import 'typescript';
import {Col, Row, Container, Navbar, Button, Dropdown, DropdownButton, Table} from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

import {
    Link,
    useParams,
    useRouteMatch,
    withRouter
} from "react-router-dom";

import ReactMarkdown from 'react-markdown';
import Form from "react-bootstrap/esm/Form";

function Description(props) {
    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const [ name, setName ] =useState('');
    const [ timeLimit, setTimeLimit] = useState(0);
    const [ memoryLimit, setMemoryLimit] = useState(0);
    const [ problemDescription, setProblemDescription] = useState('');
    const [ inputDescription, setInputDescription] = useState('');
    const [ outputDescription, setOutputDescription] = useState('');
    const [ difficulty, setDifficulty] = useState(0);
    const [ category, setCategory ] = useState([]);
    const [ sampleInput, setSampleInput ] = useState('');
    const [ sampleOutput, setSampleOutput ] = useState('');
    const [ spj, setSpj] = useState(false);

    const [ markdown, setMarkdown ] = useState('');

    useEffect(() => {
        async function getDescription() {
            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.get('/problems/getProblemDescription/' + id)
                .then(result => {
                    setName(result.data.name);
                    setMemoryLimit(result.data.memory_limit / 1024 / 1024);
                    setTimeLimit(result.data.time_limit / 1000);
                    setProblemDescription(result.data.problem_description);
                    setInputDescription(result.data.input_description);
                    setOutputDescription(result.data.output_description);
                    setDifficulty(result.data.difficulty);
                    setCategory(result.data.category);
                    setSampleInput(result.data.sample_input);
                    setSampleOutput(result.data.sample_output);
                    setSpj(result.data.spj);
                }).catch(err => {
                    if(err.response === undefined) {
                        alert('서버와 연결이 끊겼습니다.');
                    }
                    else if(err.response.data.message === 'not-exist-problem') {
                        alert('그런 문제는 없습니다.');
                        props.history.push('/');
                    }
                    else {
                        alert('서버에 오류가 생겼습니다.');
                    }
            });
        };
        getDescription();
    }, []);

    return (
        <div className="Description" style={{"height":"100%"}}>
            <Row>
                <Col sm="12">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>시간 제한</th>
                                <th>메모리 제한</th>
                                <th>SPJ</th>
                                <th>난이도</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{timeLimit} 초</td>
                                <td>{memoryLimit} MB</td>
                                <td>{spj ? <b>SPJ</b> : <b>none-spj</b>}</td>
                                <td>{difficulty}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <ReactMarkdown source={`# ${name}`}/>
                    <ReactMarkdown source="***"/>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <ReactMarkdown source="## 문제"/>
                    <ReactMarkdown source="***"/>
                    <ReactMarkdown source={problemDescription}/>
                    <ReactMarkdown source="---"/>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <ReactMarkdown source="## 입력"/>
                    <ReactMarkdown source="***"/>
                    <ReactMarkdown source={inputDescription}/>
                    <ReactMarkdown source="---"/>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <ReactMarkdown source="## 출력"/>
                    <ReactMarkdown source="***"/>
                    <ReactMarkdown source={outputDescription}/>
                    <ReactMarkdown source="---"/>
                </Col>
            </Row>

            <Row>
                <Col sm="6">
                    <ReactMarkdown source="## 예제 입력"/>
                    <ReactMarkdown source={`\`\`\`alias\n${sampleInput}\n\`\`\`\n`}/>
                </Col>
                <Col sm="6">
                    <ReactMarkdown source="## 예제 출력"/>
                    <ReactMarkdown source={`\`\`\`alias\n${sampleOutput}\n\`\`\`\n`}/>
                </Col>
            </Row>

            <Row>
                <Col sm="12">
                    <ReactMarkdown source="---"/>
                    <Link to={url + '/submitMode'}><Button variant="primary w-100"> 코드 작성 </Button></Link>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(Description);