// 액션 타입 정의
const SET_USER_EMAIL = 'email/SET_USER_EMAIL';

// 액션 생섬함수 정의
export const setUserEmail = input_email => ({ type: SET_USER_EMAIL, input_email });

// **** 초기상태 정의
const initialState = '';

// **** 리듀서 작성
export default function userEmail(state = initialState, action) {
    switch (action.type) {
        case SET_USER_EMAIL:
            return action.input_email;
        default:
            return state;
    }
}