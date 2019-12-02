import { combineReducers } from 'redux';
import token from './token';
import isLoggedIn from './isLoggedIn';
import userEmail from './userEmail';
import userName from './userName';
import userNickname from './userNickname';
import chattingSocket from './chattingSocket';

export default combineReducers({
    token,
    isLoggedIn,
    userEmail,
    userName,
    userNickname,
    chattingSocket
    // 다른 리듀서를 만들게되면 여기에 넣어줍니다.
});