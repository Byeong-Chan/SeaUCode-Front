// 액션 타입 정의
const SET_USER_NICKNAME = 'nickname/SET_USER_NICKNAME';

// 액션 생섬함수 정의
export const setUserNickname = input_nickname => ({ type: SET_USER_NICKNAME, input_nickname });

// **** 초기상태 정의
const initialState = '';

// **** 리듀서 작성
export default function userNickname(state = initialState, action) {
    switch (action.type) {
        case SET_USER_NICKNAME:
            return action.input_nickname;
        default:
            return state;
    }
}