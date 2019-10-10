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
                resolve(axios.post('localhost:3000/register',
                    {email: email, password: password, role: parseInt(role)},
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }));
            }
        }).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
            if (err === 'password-different') {
                alert('비밀번호와 확인 비밀번호가 다릅니다.');
            }
            else {
                alert("i'm sorry.");
            }
        });
    }

    return (
        <div className="RegisterForm">
            <input value={email} placeholder="이메일" onChange={emailChange}/>
            <br/>
            <input value={password} placeholder="비밀번호" onChange={passwordChange}/>
            <br/>
            <input value={confirmPassword} placeholder="비밀번호 확인" onChange={confirmPasswordChange}/>
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
