const config = require('./config');
const setToken = refresh_token => ({ type: config.SET_TOKEN, refresh_token });
const toggleLoggedIn = on_off => ({ type: config.TOGGLE_LOGGED_IN, on_off });
const setUserEmail = input_email => ({ type: config.SET_USER_EMAIL, input_email});
const setUserName = input_name => ({ type: config.SET_USER_NAME, input_name});
const setUserNickname = input_nickname => ({ type: config.SET_USER_NICKNAME, input_nickname});

module.exports = {
    loggedInTest: function(axios, cookies, dispatch) {
        const refresh_token = cookies.access_token || '';
        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.defaults.headers.common['x-access-token'] = refresh_token;
        return axios.get('/loggedIn').then(response => {
            dispatch(setUserEmail(response.data.email));
            dispatch(setUserName(response.data.name));
            dispatch(setUserNickname(response.data.nickname));
            return dispatch(toggleLoggedIn(true));
        }).then(() => {
            return dispatch(setToken(refresh_token));
        });
    },
    axiosInit: function(axios, token) {
        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.defaults.headers.common['x-access-token'] = token;
    }
};