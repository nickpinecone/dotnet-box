import { useState } from 'react';
import m from './registration.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Registration() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassowrd] = useState([])

  const onLogin = async () => {
    if (isValidEmail(login) && isValidPassword(password)) {
      try {
        console.log(name, password, login)
        const { user } = await axios.post('http://localhost:4000/api/users/register', {
          username: name,
          password: password,
          email: login
        })

        const { data } = await axios.post('http://localhost:4000/api/users/login', {
          email: login,
          password: password
        })
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("id", data.user._id)
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }


  return (
    <div className={m.enter_container}>
      <form className={m.container_login}>
        <h2 className={m.login_title}>Регистрация</h2>
        <ul className={m.inputs}>
          <li className={m.inputs_item}>
            <p className={m.inputs_item_text}>ФИО</p>
            <input className={m.inputs_item_input} value={name} onChange={(e) => { setName(e.target.value) }} type="text" />
          </li>
          <li className={m.inputs_item}>
            <p className={m.inputs_item_text}>Email</p>
            <input className={m.inputs_item_input} value={login} onChange={(e) => { setLogin(e.target.value) }} type="text" />
          </li>
          <li className={m.inputs_item}>
            <p className={m.inputs_item_text}>Пароль</p>
            <input className={m.inputs_item_input} value={password} onChange={(e) => { setPassowrd(e.target.value) }} type="password" />
          </li>
        </ul>
        <div className={m.container_button_enter}>
          <button class={m.bth_enter} onClick={() => { onLogin() }} type="button">Войти</button>
        </div>
      </form>
    </div>
  );
}

export default Registration;
