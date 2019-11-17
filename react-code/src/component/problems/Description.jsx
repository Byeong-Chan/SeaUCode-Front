import React, { useState, useEffect } from 'react';
import 'typescript';
import {Col, Row, Container, Navbar, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import reactMarkdown from 'react-markdown';
import axios from 'axios';
import config from '../../config';

import {
    Link,
    useParams,
    useRouteMatch,
    withRouter
} from "react-router-dom";

function Description(props) {
    const { path, url } = useRouteMatch();
    const { id } = useParams();

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
                    let preMarkdown = "| Fun                  | With                 | Tables          |\n" +
                        "| :------------------- | -------------------: |:---------------:|\n" +
                        "| left-aligned column  | right-aligned column | centered column |\n" +
                        "| $100                 | $100                 | $100            |\n" +
                        "| $10                  | $10                  | $10             |\n" +
                        "| $1                   | $1                   | $1              |\n";

                    setMarkdown(preMarkdown);

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
            <reactMarkdown source="markdown"/>
            메모리 제한: {memoryLimit} MB
            <br/>
            시간 제한: {timeLimit} sec
            <br/>
            문제 디스크립션: {problemDescription}
            <br/>
            입력 디스크립션: {inputDescription}
            <br/>
            출력 디스크립션: {outputDescription}
            <br/>
            난이도: {difficulty}
            <br/>
            알고리즘 종류: {category}
            <br/>
            입력 예제: {sampleInput}
            <br/>
            출력 예졔: {sampleOutput}
            <br/>
            스페셜 저지: {spj.toString()}
            <br/>
            <Link to={url + '/submitMode'}><Button> 코드 작성 </Button></Link>
        </div>
    );
}

export default withRouter(Description);