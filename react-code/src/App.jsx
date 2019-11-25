import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';
import LoggedInUserTopNav from './component/LoggedInUserTopNav';
import CreateClass from './component/CreateClass';
import IndexPage from './component/IndexPage';
import Class from './component/class/Class';
import ClassList from './component/class/ClassList';
import MyPage from './component/MyPage';
import Problem from './component/problems/Problem';
import ProblemList from './component/problems/ProblemList';
import MyJudges from './component/MyJudges';
import JudgeResult from './component/JudgeResult';
import AdminPage from './component/admin/AdminPage';

import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, ButtonToolbar, Navbar, Nav, Row, Col, Container} from 'react-bootstrap';
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

import generalFunctions from './generalFunctions';
import config from "./config";

const setToken = refresh_token => ({ type: "token/SET_TOKEN", refresh_token });
const toggleLoggedIn = on_off => ({type: config.TOGGLE_LOGGED_IN, on_off});

function DefaultTopBar(props) {
    return (
        <React.Fragment>
            <ButtonToolbar>
                <Button variant="dark" onClick={() => props.setLoginModalShow(true)}>
                    로그인
                </Button>

                <LoginForm
                    show={props.loginModalShow}
                    onHide={() => props.setLoginModalShow(false)}
                />
            </ButtonToolbar>

            <ButtonToolbar>
                <Button variant="dark" onClick={() => props.setRegisterModalShow(true)}>
                    회원 가입
                </Button>

                <RegisterForm
                    show={props.registerModalShow}
                    onHide={() => props.setRegisterModalShow(false)}
                />
            </ButtonToolbar>
        </React.Fragment>
    );
}

function Greeting(props) {
    if(props.isLoggedIn) {
        return <LoggedInUserTopNav setIsTeacher={props.setIsTeacher} />;
    }
    else {
        return <DefaultTopBar
            registerModalShow={props.registerModalShow}
            setRegisterModalShow={props.setRegisterModalShow}
            loginModalShow={props.loginModalShow}
            setLoginModalShow={props.setLoginModalShow}
        />;
    }
}

function App() {
    const isLoggedIn = useSelector(
        state => state.isLoggedIn
    );

    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    useEffect(() => {
        async function cookie_update() {
            const refresh_token = cookies.access_token || '';

            generalFunctions.axiosInit(axios, refresh_token);
            generalFunctions.loggedInTest(axios, cookies, dispatch)
                .catch(err => {
                    dispatch(toggleLoggedIn(false));
                    dispatch(setToken(''));
                    removeCookie('access_token', {path: '/'});
                });
        };
        cookie_update();
    }, [cookies, dispatch, removeCookie]);

    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);

    return (
        <Container className="App" style={{marginLeft:0, marginRight:0, paddingLeft:0, paddingRight:0, maxWidth: 1440}}>
            <Row>
                <Col lg={12}>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
                        <Link to="/"><Navbar.Brand>SeaUCode</Navbar.Brand></Link>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Greeting isLoggedIn={isLoggedIn}
                                          registerModalShow={registerModalShow}
                                          setRegisterModalShow={setRegisterModalShow}
                                          loginModalShow={loginModalShow}
                                          setLoginModalShow={setLoginModalShow}
                                          setIsTeacher={setIsTeacher}
                                />
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
            <Row style={{"height":"92.5vh"}}>
                <Col lg={12}>
                    <Switch>
                        <Route path="/admin">
                            <AdminPage/>
                        </Route>

                        <Route path="/problems/:id">
                            <Problem />
                        </Route>

                        <Route path="/problems">
                            <ProblemList />
                        </Route>

                        <Route path="/class/:id">
                            <Class isTeacher={isTeacher}/>
                        </Route>

                        <Route path="/class">
                            <ClassList/>
                        </Route>

                        <Route path="/createClass">
                            <CreateClass />
                        </Route>

                        <Route path="/myJudges/:id">
                            <JudgeResult/>
                        </Route>

                        <Route path="/myJudges">
                            <MyJudges />
                        </Route>

                        <Route path="/myPage">
                            <MyPage />
                        </Route>

                        <Route path="/">
                            <IndexPage />
                        </Route>
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
