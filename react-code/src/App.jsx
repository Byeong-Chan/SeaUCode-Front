import React, { useEffect, useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'typescript';

import RegisterForm from './component/RegisterForm';
import LoginForm from './component/LoginForm';
import LoggedInUserTopNav from './component/LoggedInUserTopNav';
import CreateClass from './component/CreateClass';
import IndexPage from './component/IndexPage';

import { useSelector, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Button, ButtonToolbar, Navbar, Nav, Carousel} from 'react-bootstrap';
import {
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

import config from './config';

const setToken = refresh_token => ({ type: config.SET_TOKEN, refresh_token });
const toggleLoggedIn = on_off => ({ type: config.TOGGLE_LOGGED_IN, on_off });

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
        return <LoggedInUserTopNav />;
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

    const [cookies] = useCookies(['access_token']);

    const dispatch = useDispatch();

    useEffect(() => {
        async function cookie_update() {
            const refresh_token = cookies.access_token || '';
            dispatch(setToken(refresh_token));

            axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
            axios.defaults.headers.common['x-access-token'] = refresh_token;
            axios.get('/loggedIn').then(response => { // TODO: logintest 가 아니라 유저정보 가져오는 쿼리를 쓸것
                //TODO: redux에 유저정보 저장하고 시작할 것
                console.log(response); // TODO response.data 에 정보가 들어있습니다. 이 로그는 제거하고 작업해주세요.
                dispatch(toggleLoggedIn(true));
            }).catch(err => {
                dispatch(toggleLoggedIn(false));
            });
        };
        cookie_update();
    }, [cookies, dispatch]);

    const [registerModalShow, setRegisterModalShow] = useState(false);
    const [loginModalShow, setLoginModalShow] = useState(false);

    return (
        <div className="App">
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
                <Link to="/"><Navbar.Brand>React-Bootstrap</Navbar.Brand></Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Greeting isLoggedIn={isLoggedIn}
                                  registerModalShow={registerModalShow}
                                  setRegisterModalShow={setRegisterModalShow}
                                  loginModalShow={loginModalShow}
                                  setLoginModalShow={setLoginModalShow}
                        />
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div>
                <Switch>

                    <Route path="/createClass">
                        <CreateClass />
                    </Route>

                    <Route path="/">
                        <IndexPage />
                    </Route>

                </Switch>
            </div>
        </div>
    );
}

export default App;
