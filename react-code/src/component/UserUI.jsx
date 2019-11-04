import React from 'react';
import 'typescript';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { Button } from 'react-bootstrap'

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
            <Button onClick={logout} variant="dark">로그아웃</Button>
        </div>
    );
}

export default UserUI;