import React from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

const clearToken = () => ({ type: "token/CLEAR_TOKEN" });

function UserUI() {
    const [Cookie, setCookie, removeCookie] = useCookies(['access_token']);

    const dispatch = useDispatch();

    const logout = e => {
        dispatch(clearToken());
        removeCookie('access_token');
    };

    return (
        <div className="UserUI">
            환영합니다.
            <br/>
            <button onClick={logout}>로그아웃</button>
        </div>
    );
}

export default UserUI;