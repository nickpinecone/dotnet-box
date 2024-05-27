import { useState } from 'react';
import m from './login.module.css'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom';

import * as VKID from '@vkid/sdk';

VKID.Config.set({
  app: 51923617, // Идентификатор приложения.
  redirectUrl: "https://threedotsellipsis.github.io/digital-portfolio", // Адрес для перехода после авторизации.
});

function Login() {

  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassowrd] = useState('')

  const [error, setError] = useState(false)
  const [tapInit, setTapInit] = useState(false);

  const onLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/users/login', {
        email: login,
        password: password
      })
      localStorage.setItem("token", data.accessToken)
      localStorage.setItem("id", data.user._id)
      navigate('/')
    } catch (error) {
      setError(true)
      console.log(error)
    }
  }

  const init = async (container) => {
    if (!tapInit) {
      setTapInit(true);
      const oneTap = new VKID.OneTap();

      if (container) {
        oneTap.render({ container: container, scheme: VKID.Scheme.LIGHT, lang: VKID.Languages.RUS });
      }
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
            <input value={password} onChange={(e) => { setPassowrd(e.target.value); setError(false) }} className={`${m.inputs_item_input} ${error ? m.inputs_item_input_error : ''} `} type="password" />
          </li>
        </ul>
        <div className={m.container_button_enter}>
          <button className={m.enter} onClick={() => { onLogin() }} type="button">Войти</button>
        </div>
      </form>
      <Link className={m.login_recover_password} to="./restore_password">Забыл пароль?</Link>
      <div className={m.container_icon_enter} ref={(element) => { init(element) }}></div>
      <p className={m.no_account}>Нет аккаунта? <Link className={m.registration_link} to="../registration">Зарегистрироваться</Link></p>
    </div>
  );
}

export default Login;
