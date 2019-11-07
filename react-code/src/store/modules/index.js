import { combineReducers } from 'redux';
import token from './token';
import isLoggedIn from './isLoggedIn';

export default combineReducers({
    token,
    isLoggedIn,
    // 다른 리듀서를 만들게되면 여기에 넣어줍니다.
});