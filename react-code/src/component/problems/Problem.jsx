import React from 'react';
import 'typescript';
import {Col, Row, Container, Navbar, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import Ide from './Ide';
import Description from './Description';

import {
    Route,
    Switch,
    useRouteMatch,
    withRouter
} from "react-router-dom";

function Problem(props) {
    const { path, url } = useRouteMatch();

    return (
        <div className="Problems" style={{"height":"100%"}}>
            <Switch>
                <Route path={`${path}/submitMode`}>
                    <Ide />
                </Route>
                <Route path={`${path}`}>
                    <Description />
                </Route>
            </Switch>
        </div>
    );
}

export default withRouter(Problem);