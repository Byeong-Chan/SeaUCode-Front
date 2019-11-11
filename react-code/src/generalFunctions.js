module.exports = {
    isTokenExist: function(isLoggedIn, cookies, dispatch, toggleLoggedIn, setToken) {
        if(!isLoggedIn) {
            const refresh_token = cookies.access_token || '';
            if(refresh_token != '') {
                dispatch(toggleLoggedIn(true));
                dispatch(setToken(refresh_token));
            }
            else {
                dispatch(toggleLoggedIn(false));
                dispatch(setToken(''));
            }
        }
    },
    axiosInit: function(axios, token, config) {
        axios.defaults.baseURL = config.serverURL; // TODO: 나중에 제대로 포워딩 할 것
        axios.defaults.headers.common['x-access-token'] = token;
    }
};