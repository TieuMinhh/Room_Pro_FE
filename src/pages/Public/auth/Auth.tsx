'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoginTenantAPIs, RegisterTenantAPIs } from '@/store/slice/userSlice';
import { PhoneCallIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const FormAuth = ({ open, setOpen }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');


  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!email || !password) return;
    const data = { email, password };
    const result: any = await dispatch(LoginTenantAPIs(data));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success('Đăng nhập thành công!');
      setOpen(false);
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!email || !password || !phone || !displayName) {
      toast.warn('Vui lòng điền đầy đủ các trường!');
      return;
    }

    if (password !== confirmPassword) {
      toast.warn('Mật khẩu xác nhận không khớp!');
      return;
    }

    const data = { email, password, phone, displayName };
    const result: any = await dispatch(RegisterTenantAPIs(data));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      setIsLogin(true);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <StyledWrapper>
          <DialogTitle className="text-xl font-semibold">
            {isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </DialogTitle>
          <form className="form" onSubmit={isLogin ? handleLogin : handleRegister}>
            {/* Display Name if Register */}
            {!isLogin && (
              <>
                <div className="flex-column">
                  <label>Họ và tên</label>
                </div>
                <div className="inputForm">
                  <UserIcon size={20} />
                  <input type="text" className="input" placeholder="Enter your full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </div>
              </>
            )}

            {/* Email */}
            <div className="flex-column">
              <label>Email</label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></g></svg>
              <input type="text" className="input" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password */}
            <div className="flex-column">
              <label>Password</label>
            </div>
            <div className="inputForm">
              <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
              <input type="password" className="input" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Confirm Password & Phone if Register */}
            {!isLogin && (
              <>
                <div className="flex-column">
                  <label>Confirm Password</label>
                </div>
                <div className="inputForm">
                  <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" /><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" /></svg>
                  <input type="password" className="input" placeholder="Confirm your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <div className="flex-column">
                  <label>Số điện thoại</label>
                </div>
                <div className="inputForm">
                  <PhoneCallIcon size={20} />

                  <input type="text" className="input" placeholder="Enter your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}

            {/* Quên mật khẩu */}
            {isLogin && (
              <div className="flex-row">
                <span className="span">Quên mật khẩu?</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="button-submit">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>

            {/* Đổi giữa login/register */}
            <p className="p">
              {isLogin ? 'Bạn chưa có tài khoản?' : 'Bạn đã có tài khoản?'}{' '}
              <span className="span" onClick={() => {
                setIsLogin(!isLogin)
                setPassword('')
                setConfirmPassword('')
                setPhone('')
                setDisplayName('')
              }}>
                {isLogin ? 'Đăng ký' : 'Đăng nhập'}
              </span>
            </p>
          </form>
        </StyledWrapper>
      </DialogContent>
    </Dialog>
  );
};

const StyledWrapper = styled.div`
  /* Giữ nguyên style bạn đã viết */
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #ffffff;
    padding: 30px;
    width: 450px;
    border-radius: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  ::placeholder {
    font-family: inherit;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 600;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }

  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #2d79f3;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: #151717;
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #252727;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }
`;

export default FormAuth;
