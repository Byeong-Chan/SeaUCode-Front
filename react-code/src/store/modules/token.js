// 액션 타입 정의
const CLEAR_TOKEN = 'token/CLEAR_TOKEN';
const SET_TOKEN = 'token/SET_TOKEN';

// 액션 생섬함수 정의
export const clearToken = () => ({ type: CLEAR_TOKEN });
export const setToken = refresh_token => ({ type: SET_TOKEN, refresh_token });

// **** 초기상태 정의
const initialState = '';

// **** 리듀서 작성
export default function token(state = initialState, action) {
    switch (action.type) {
        case CLEAR_TOKEN:
            return '';
        case SET_TOKEN:
            return action.refresh_token;
        default:
            return state;
    }
}