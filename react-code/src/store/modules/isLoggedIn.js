// 액션 타입 정의
const TOGGLE_LOGGED_IN = 'isLoggedIn/TOGGLE_LOGGED_IN';

// 액션 생섬함수 정의
export const toggleLoggedIn = on_off => ({ type: TOGGLE_LOGGED_IN, on_off });

// **** 초기상태 정의
const initialState = false;

// **** 리듀서 작성
export default function isLoggedIn(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_LOGGED_IN:
            return action.on_off;
        default:
            return state;
    }
}