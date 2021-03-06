import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as monaco from 'monaco-editor'

import { CookiesProvider } from 'react-cookie';

import { createStore } from 'redux';
import rootReducer from './store/modules';
import { Provider } from 'react-redux';
import DocumentTitle from 'react-document-title';

import { BrowserRouter as Router } from 'react-router-dom';

const store = createStore(rootReducer);



ReactDOM.render(
    <Router>
        <CookiesProvider>
            <Provider store={store}>
                <DocumentTitle title='SeaUCode'>
                    <App />
                </DocumentTitle>
            </Provider>
        </CookiesProvider>
    </Router>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
