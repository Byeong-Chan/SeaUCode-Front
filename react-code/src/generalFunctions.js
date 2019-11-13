module.exports = {
    loggedInTest: function(axios, config, isLoggedIn, cookies, dispatch, toggleLoggedIn, setToken) {
        const refresh_token = cookies.access_token || '';
        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.defaults.headers.common['x-access-token'] = refresh_token;
        return axios.get('/loggedIn').then(response => {
            // TODO: 유저정보 입력
            return dispatch(toggleLoggedIn(true));
        }).then(() => {
            return dispatch(setToken(refresh_token));
        });
    },
    axiosInit: function(axios, token, config) {
        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.defaults.headers.common['x-access-token'] = token;
    }
};