import React, { useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import 'typescript';

import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import MonacoEditor from 'react-monaco-editor';

import axios from 'axios';
import {Col, Row, Form, Button, Card} from 'react-bootstrap';

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

const pageStyle = {
    maxWidth: "960px",
    margin: "40px auto"
}
const cardStyle = {
    marginBottom: "10px"
}
const completeBtnStyle = {
    height: "93%",
    fontSize: "large",
    fontWeight: "bold",
    minHeight: "50px"
}

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
                <Col md={2}>
                    {i + 1} input
                </Col>
                <Col md={4}>
                     <input id={(i + 1) + "inputFileAdmin"} type="file" onChange={changeInput}/>
                </Col>
                <Col md={2}>
                    {i + 1} output
                </Col>
                <Col md={4}>
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

function ProblemAdd(props) {
    const dispatch = useDispatch();
    const [cookies, setCookies, removeCookies] = useCookies(['access_token']);

    const { path, url } = useRouteMatch();
    const { id } = useParams();

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

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
        const formData = new FormData();
        for(const key of Object.keys(form)) {
            if(key === 'input_list' || key === 'output_list') {
                for(let i = 0; i < form[key].length; i++) formData.append(key, form[key][i].txt);
            }
            else if(key === 'Category') {
                for(let i = 0; i < form[key].length; i++) formData.append(key, form[key][i]);
            }
            else formData.append(key, form[key]);
        }
        for(let i = 0; i < acceptedFiles.length; i++) {
            formData.append('files', acceptedFiles[i]);
        }
        generalFunctions.axiosInit(axios, cookies.access_token);
        axios.post('/admin/addProblem', formData).then(response => {
            alert('문제가 생성되었습니다.');
            props.history.goBack(`${url}`);
        }).catch(err => {
            if(err.response === undefined) {
                alert('서버와의 연결이 끊어졌습니다.')
            }
        })
    };

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <div className="ProblemAdd" style={pageStyle}>
            <h3 style={{textAlign: "center"}}>새 문제 등록</h3>
            <hr/>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **문제 이름**"/>
                </Card.Header>
                <Card.Body>
                    <Form.Control type="text" value={name} onChange={changeName} />
                </Card.Body>
            </Card>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **문제 디스크립션**"/>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
            </Card>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **입력 디스크립션**"/>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
            </Card>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **출력 디스크립션**"/>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
            </Card>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **예제 입력**"/>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
            </Card>
            <Card style={cardStyle}>
                <Card.Header>
                    <ReactMarkdown source="##### **예제 출력**"/>
                </Card.Header>
                <Card.Body>
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
                </Card.Body>
            </Card>
            <Row>
                <Col md={4} sm={12}>
                    <Card style={cardStyle}>
                        <Card.Header>
                            <ReactMarkdown source="##### **난이도**"/>
                        </Card.Header>
                        <Card.Body>
                            <Form.Control type="number" value={difficulty} onChange={changeDifficulty} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={12}>
                    <Card style={cardStyle}>
                        <Card.Header>
                            <ReactMarkdown source="##### **시간 제한(sec)**"/>
                        </Card.Header>
                        <Card.Body>
                            <Form.Control type="number" value={timeLimit} onChange={changeTimeLimit} />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} sm={12}>
                    <Card style={cardStyle}>
                        <Card.Header>
                            <ReactMarkdown source="##### **메모리(MB)**"/>
                        </Card.Header>
                        <Card.Body>
                            <Form.Control type="number" value={memoryLimit} onChange={changeMemoryLimit} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="8" sm="12">
                    <Card style={cardStyle}>
                        <Card.Header>
                            <Row>
                                <Col sm="4">
                                    <ReactMarkdown source="##### **카테고리**"/>
                                </Col>
                                <Col sm="4">
                                    <Button variant="primary w-100" onClick={addCategory}> add Category </Button>
                                </Col>
                                <Col sm="4">
                                    <Button variant="danger w-100" onClick={deleteCategory}> delete Category </Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <CategoryList changeCategory={changeCategory} category={category}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4" sm="12">
                    <Card style={cardStyle}>
                        <Card.Header>
                            <Button variant="primary w-100" onClick={changeIsSpj}> SPJ 사용 </Button>
                        </Card.Header>
                        <Card.Body>
                            {isSpj ? <input type="file" onChange={changeSpjCode}/> : ''}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="12">
                    <Card style={cardStyle}>
                        <Card.Header>
                            <Row>
                                <Col sm="6">
                                    <ReactMarkdown source="##### **input & output 데이터**"/>
                                </Col>
                                <Col sm="3">
                                    <Button variant="primary w-100" onClick={addInputOutput}>add data</Button>
                                </Col>
                                <Col sm="3">
                                    <Button variant="danger w-100" onClick={deleteInputOutput}>delete data</Button>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <IOList changeInputList={changeInputList} changeOutputList={changeOutputList} inputList={inputList} outputList={outputList} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md="8" sm="12">
                    <Card style={cardStyle}>
                        <Card.Header>
                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                <Button> 파일첨부(이미지 혹은 pdf) </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <aside>
                                <ul>{files}</ul>
                            </aside>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md="4" sm="12">
                    <Button variant="dark w-100" onClick={submitProblem} style={completeBtnStyle}> 문제 생성! </Button>
                </Col>
            </Row>
        </div>
    );
}

export default withRouter(ProblemAdd);