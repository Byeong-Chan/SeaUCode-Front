import React, {useState} from 'react';
import 'typescript';
import axios from 'axios';

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("1");

    const emailChange = e => {
        setEmail(e.target.value);
    };
    const passwordChange = e => {
        setPassword(e.target.value);
    };
    const confirmPasswordChange = e => {
        setConfirmPassword(e.target.value);
    };
    const roleChange = e => {
        setRole(e.target.value);
    };
    const postRegist = e => {
        new Promise((resolve, reject) => {
            if (confirmPassword !== password) {
                reject('password-different');
            }
            else {
                axios.defaults.baseURL = 'http://127.0.0.1:3000';
                resolve(axios.post('/register',
                    {email: email, password: password, role: parseInt(role)}));
            }
        }).then(response => {
            //TODO: 회원가입 성공 메시지를 띄우세요. 
            console.log(response);
        }).catch(err => {
            if (err === 'password-different') {
                alert('비밀번호와 확인 비밀번호가 다릅니다.');
            }
            else {
                if(err.response === undefined) {
                    alert('서버와 연결이 끊어졌습니다.');
                }
                else if(err.response.data.message === "email-form-error") {
                    alert('제대로 된 이메일을 써주세요.');
                }
                else if(err.response.data.message === "already-register") {
                    alert('이미 등록되어있습니다.');
                }
                else if(err.response.data.message === "password-error") {
                    alert('password 규칙을 확인해주세요.');
                }
                else {
                    alert('서버에 문제가 있습니다.');
                }
            }
        });
    };

    return (
        <div className="RegisterForm">
            <input value={email} placeholder="이메일" onChange={emailChange}/>
            <br/>
            <input type="password" value={password} placeholder="비밀번호" onChange={passwordChange}/>
            <br/>
            <input type="password" value={confirmPassword} placeholder="비밀번호 확인" onChange={confirmPasswordChange}/>
            <form>
                <div className="radio">
                    <label>
                        선생님
                        <input type="radio" value="1"
                               checked={role === "1"}
                               onChange={roleChange} />
                    </label>
                </div>
                <div className="radio">
                    <label>
                        학생
                        <input type="radio" value="2"
                               checked={role === "2"}
                               onChange={roleChange} />
                    </label>
                </div>
            </form>
            <button onClick={postRegist}>제출</button>
        </div>
    );
}

export default RegisterForm;
