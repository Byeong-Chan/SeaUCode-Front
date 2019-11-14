// 액션 타입 정의
const SET_USER_NAME = 'name/SET_USER_NAME';

// 액션 생섬함수 정의
export const setUserName = input_name => ({ type: SET_USER_NAME, input_name });

// **** 초기상태 정의
const initialState = '';

// **** 리듀서 작성
export default function userName(state = initialState, action) {
    switch (action.type) {
        case SET_USER_NAME:
            return action.input_name;
        default:
            return state;
    }
}