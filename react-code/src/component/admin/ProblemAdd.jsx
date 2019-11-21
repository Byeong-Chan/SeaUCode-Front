import React, { useEffect, useState } from 'react';
import 'typescript';

import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import MonacoEditor from 'react-monaco-editor';

import axios from 'axios';
import {Col, Row, Form, Button} from 'react-bootstrap';

import ReactMarkdown from 'react-markdown';
import generalFunctions from '../../generalFunctions';

import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams,
    withRouter
} from "react-router-dom";

function IOList(props) {
    const renders = [];

    const changeInput = e => {
        const input_id = parseInt(e.target.id.split("inputFileAdmin")[0]);
        if(e.target.files.length === 0) {
            props.changeInputList(input_id, '');
        }
        else {
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = reader.result;
                props.changeInputList(input_id, content);
            };

            reader.readAsText(e.target.files[0]);
        }
    };

    const changeOutput = e => {
        const output_id = parseInt(e.target.id.split("outputFileAdmin")[0]);
        if(e.target.files.length === 0) {
            props.changeOutputList(output_id, '');
        }
        else {
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = reader.result;
                props.changeOutputList(output_id, content);
            };

            reader.readAsText(e.target.files[0]);
        }
    };

    for(let i = 0; i < props.inputList.length; i++) {
        renders.push((
            <Row key={(i + 1) + "IOList"}>
                <Col lg={1}>
                    {i + 1} input
                </Col>
                <Col lg={5}>
                     <input id={(i + 1) + "inputFileAdmin"} type="file" onChange={changeInput}/>
                </Col>
                <Col lg={1}>
                    {i + 1} output
                </Col>
                <Col lg={5}>
                    <input id={(i + 1) + "outputFileAdmin"}type="file" onChange={changeOutput}/>
                </Col>
            </Row>
                ));
    }

    return renders;
}

function CategoryList(props) {
    const renders = [];

    const changeCategoryList = e => {
        const category_id = e.target.id.split("CategoryAdmin")[0];
        props.changeCategory(category_id, e.target.value);
    };

    for(let i = 0; i < props.category.length; i++) {
        renders.push((
            <Row key={(i + 1) + "CategoryList"}>
                <Col lg={2}>
                    {i + 1}번 카테고리
                </Col>
                <Col lg={10}>
                    <Form.Control id={(i + 1) + "CategoryAdmin"} type="text" value={props.category[i]} onChange={changeCategoryList}/>
                </Col>
            </Row>
        ));
    }

    return renders;
}

function AdminPage(props) {
    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [problemDescription, setProblemDescription] = useState('');

    const [inputDescription, setInputDescription] = useState('');
    const [outputDescription, setOutputDescription] = useState('');

    const [sampleInput, setSampleInput] = useState('');
    const [sampleOutput, setSampleOutput] = useState('');

    const [inputList, setInputList] =  useState([]);
    const [outputList, setOutputList] =  useState([]);

    const [difficulty, setDifficulty] = useState(0);

    const [category, setCategory] = useState([]);

    const [isSpj, setIsSpj] = useState(false);
    const [spjCode, setSpjCode] = useState('');

    const [timeLimit, setTimeLimit] = useState(0);
    const [memoryLimit, setMemoryLimit] = useState(0);

    const [images, setImages] = useState([]);
    const [solution, setSolution] = useState('');
    const [solutionFile, setSolutionFile] = useState(null);

    const options = {
        selectOnLineNumbers: true
    };

    const changeName = e => {
        setName(e.target.value);
    };
    const changeDifficulty = e => {
        setDifficulty(e.target.value);
    };
    const changeIsSpj = e => {
        setIsSpj(!isSpj);
    };

    function problemDescriptionDidMount(editor, monaco) {
        editor.focus();
    }
    const onProblemDescriptionChange = e => {
        setProblemDescription(e);
    };

    function inputDescriptionDidMount(editor, monaco) {
        editor.focus();
    }
    const onInputDescriptionChange = e => {
        setInputDescription(e);
    };

    function outputDescriptionDidMount(editor, monaco) {
        editor.focus();
    }
    const onOutputDescriptionChange = e => {
        setOutputDescription(e);
    };

    function sampleInputDidMount(editor, monaco) {
        editor.focus();
    }
    const onSampleInputChange = e => {
        setSampleInput(e);
    };

    function sampleOutputDidMount(editor, monaco) {
        editor.focus();
    }

    const onSampleOutputChange = e => {
        setSampleOutput(e);
    };

    const changeTimeLimit = e => {
        setTimeLimit(e.target.value);
    };

    const changeMemoryLimit = e => {
        setMemoryLimit(e.target.value);
    };

    const changeInputList = (_id, txt) => {
        const newInputList = inputList.concat();
        newInputList[_id - 1] = { _id: _id, txt: txt };
        setInputList(newInputList);
    };

    const changeOutputList = (_id, txt) => {
        const newOutputList = outputList.concat();
        newOutputList[_id - 1] = { _id: _id, txt: txt };
        setOutputList(newOutputList);
    };

    const addInputList = () => {
        setInputList(inputList.concat([{_id: inputList.length + 1, txt: ''}]));
    };

    const addOutputList = () => {
        setOutputList(outputList.concat([{_id: outputList.length + 1, txt: ''}]));
    };

    const addInputOutput = e => {
        addInputList();
        addOutputList();
    };


    const deleteInputList = () => {
        setInputList(inputList.slice(0, -1));
    };

    const deleteOutputList = () => {
        setOutputList(outputList.slice(0, -1));
    };

    const deleteInputOutput = e => {
        if(inputList.length !== 0 && outputList.length !== 0) {
            deleteInputList();
            deleteOutputList();
        }
    };

    const addCategory = e => {
        setCategory(category.concat(['']));
    };

    const deleteCategory = e => {
        if(category.length !== 0) {
            setCategory(category.slice(0, -1));
        }
    };

    const changeCategory = (_id, txt) => {
        const newCategory = category.concat();
        newCategory[_id - 1] = txt;
        setCategory(newCategory);
    };

    const changeSpjCode = e => {
        if(e.target.files.length === 0) {
            setSpjCode('');
        }
        else {
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = reader.result;
                setSpjCode(content);
            };

            reader.readAsText(e.target.files[0]);
        }
    };

    const submitProblem = e => {
        const form = {
            name: name,
            problem_description : problemDescription,
            sample_input : sampleInput,
            sample_output : sampleOutput,
            input_description : inputDescription,
            output_description : outputDescription,
            solution : '',
            difficulty : difficulty,
            Category : category,
            input_list: inputList,
            output_list: outputList,
            spj: isSpj,
            spj_code: spjCode,
            delete_yn : false,
            memory_limit: memoryLimit,
            time_limit: timeLimit
        };
    };

    return (
        <div className="AdminPage" style={{"height":"100%"}}>
            <Row>
                <Col lg={2}>
                    <ReactMarkdown source="# 문제 이름"/>
                </Col>
                <Col lg={10}>
                    <Form.Control type="text" value={name} onChange={changeName} />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 문제 디스크립션"/>
                </Col>
                <Col lg={9}>
                    <MonacoEditor
                        width="100%"
                        height="20vh"
                        language="markdown"
                        theme="vs-white"
                        value={problemDescription}
                        options={options}
                        onChange={onProblemDescriptionChange}
                        editorDidMount={problemDescriptionDidMount}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 입력 디스크립션"/>
                </Col>
                <Col lg={9}>
                    <MonacoEditor
                        width="100%"
                        height="20vh"
                        language="markdown"
                        theme="vs-white"
                        value={inputDescription}
                        options={options}
                        onChange={onInputDescriptionChange}
                        editorDidMount={inputDescriptionDidMount}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 출력 디스크립션"/>
                </Col>
                <Col lg={9}>
                    <MonacoEditor
                        width="100%"
                        height="20vh"
                        language="markdown"
                        theme="vs-white"
                        value={outputDescription}
                        options={options}
                        onChange={onOutputDescriptionChange}
                        editorDidMount={outputDescriptionDidMount}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 예제 입력"/>
                </Col>
                <Col lg={9}>
                    <MonacoEditor
                        width="100%"
                        height="20vh"
                        language="text"
                        theme="vs-white"
                        value={sampleInput}
                        options={options}
                        onChange={onSampleInputChange}
                        editorDidMount={sampleInputDidMount}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 예제 출력"/>
                </Col>
                <Col lg={9}>
                    <MonacoEditor
                        width="100%"
                        height="20vh"
                        language="text"
                        theme="vs-white"
                        value={sampleOutput}
                        options={options}
                        onChange={onSampleOutputChange}
                        editorDidMount={sampleOutputDidMount}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={3}>
                    <ReactMarkdown source="## 난이도"/>
                </Col>
                <Col lg={9}>
                    <Form.Control type="number" value={difficulty} onChange={changeDifficulty} />
                </Col>
            </Row>

            <Row>
                <Col lg={2}>
                    <ReactMarkdown source="## 시간 제한(sec)"/>
                </Col>
                <Col lg={4}>
                    <Form.Control type="number" value={timeLimit} onChange={changeTimeLimit} />
                </Col>
                <Col lg={2}>
                    <ReactMarkdown source="## 메모리(MB)"/>
                </Col>
                <Col lg={4}>
                    <Form.Control type="number" value={memoryLimit} onChange={changeMemoryLimit} />
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <Button variant="primary w-100" onClick={addCategory}> add Category </Button>
                </Col>
                <Col lg={6}>
                    <Button variant="danger w-100" onClick={deleteCategory}> delete Category </Button>
                </Col>
            </Row>

            <CategoryList changeCategory={changeCategory} category={category}/>

            <Row>
                <Col lg={4}>
                    <Button variant="primary w-100" onClick={changeIsSpj}> SPJ 사용 </Button>
                </Col>
                <Col lg={8}>
                    {isSpj ? <input type="file" onChange={changeSpjCode}/> : ''}
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <Button variant="primary w-100" onClick={addInputOutput}>add input, output data</Button>
                </Col>
                <Col lg={6}>
                    <Button variant="danger w-100" onClick={deleteInputOutput}>delete input, output data</Button>
                </Col>
            </Row>
            <IOList changeInputList={changeInputList} changeOutputList={changeOutputList} inputList={inputList} outputList={outputList} />

            <Row>
                <Col lg={12}>
                    <Button variant="primary w-100" onClick={submitProblem}> 문제 생성! </Button>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(AdminPage);