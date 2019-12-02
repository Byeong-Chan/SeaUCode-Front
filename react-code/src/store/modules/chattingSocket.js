import io from 'socket.io-client';
import config from '../../config';

// 액션 타입 정의

// 액션 생섬함수 정의

// **** 초기상태 정의
const initialState = io.connect(config.serverURL);

// **** 리듀서 작성
export default function chattingSocket(state = initialState, action) {
    switch (action.type) {
        default:
            return state;
    }
}