import { useState } from 'react';
import m from './login.module.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassowrd] = useState('')

  const [error, setError] = useState(false)

  const onLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/users/login', {
        email: login,
        password: password
      })
      localStorage.setItem("token", data.accessToken)
      navigate('/')
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  return (
    <div className={m.enter_container}>
      <form className={m.container_login}>
        <h2 className={m.login_title}>Вход</h2>
        <ul className={m.list_inputs}>
          <li className={m.inputs_item}>
            <p className={m.inputs_item_text}>Email</p>
            <input value={login} onChange={(e) => { setLogin(e.target.value); setError(false) }} className={`${m.inputs_item_input} ${error ? m.inputs_item_input_error : ''} `} type="text" />
          </li>
          <li className={m.inputs_item}>
            <p className={m.inputs_item_text}>Пароль</p>
            <input value={password} onChange={(e) => { setPassowrd(e.target.value); setError(false) }} className={`${m.inputs_item_input} ${error ? m.inputs_item_input_error : ''} `} type="text" />
          </li>
        </ul>
        <div className={m.container_button_enter}>
          <button className={m.enter} onClick={() => { onLogin() }} type="button">Войти</button>
        </div>
      </form>
      <Link className={m.login_recover_password} to="./restore_password">Забыл пароль?</Link>
      <div className={m.container_icon_enter}>
        <svg className={m.icon} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1529_369)">
            <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF" />
            <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="white" />
          </g>
          <defs>
            <clipPath id="clip0_1529_369">
              <rect width="48" height="48" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.9995 19.6363V28.9309H36.9158C36.3487 31.9199 34.6466 34.4509 32.094 36.1527L39.883 42.1964C44.4212 38.0075 47.0394 31.8547 47.0394 24.5456C47.0394 22.8438 46.8867 21.2073 46.603 19.6366L23.9995 19.6363Z" fill="#4285F4" />
          <path d="M10.5492 28.568L8.7925 29.9128L2.57422 34.7564C6.5233 42.589 14.6172 48 23.999 48C30.4788 48 35.9115 45.8618 39.8825 42.1964L32.0934 36.1528C29.9552 37.5927 27.2279 38.4656 23.999 38.4656C17.759 38.4656 12.4574 34.2547 10.559 28.5819L10.5492 28.568Z" fill="#34A853" />
          <path d="M2.57436 13.2436C0.938084 16.4726 0 20.1163 0 23.9999C0 27.8834 0.938084 31.5271 2.57436 34.7561C2.57436 34.7777 10.5599 28.5597 10.5599 28.5597C10.08 27.1197 9.79624 25.5925 9.79624 23.9996C9.79624 22.4067 10.08 20.8795 10.5599 19.4395L2.57436 13.2436Z" fill="#FBBC05" />
          <path d="M23.9995 9.55636C27.5341 9.55636 30.6758 10.7781 33.1849 13.1345L40.0576 6.2619C35.8903 2.37833 30.4796 0 23.9995 0C14.6177 0 6.5233 5.38908 2.57422 13.2437L10.5596 19.44C12.4576 13.7672 17.7595 9.55636 23.9995 9.55636Z" fill="#EA4335" />
        </svg>
      </div>
      <p className={m.no_account}>Нет аккаунта? <Link className={m.registration_link} to="../registration">Зарегистрироваться</Link></p>
    </div>
  );
}

export default Login;
