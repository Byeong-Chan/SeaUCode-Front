import { combineReducers } from 'redux';
import token from './token';

export default combineReducers({
    token,
    // 다른 리듀서를 만들게되면 여기에 넣어줍니다.
});