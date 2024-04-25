import { useState } from 'react';
import './registration.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Registration() {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [login, setLogin] = useState('')
  const [password, setPassowrd] = useState('')

  const onLogin = async () => {
    if(isValidEmail(login) && isValidPassword(password)){
      try{
        const {user} = await axios.post('http://localhost:4000/api/users/register',{
          username: name,
          password: password,
          email: login
        })

        const {data} = await axios.post('http://localhost:4000/api/users/login',{
          email: login,
          password: password
        })
        localStorage.setItem("token", data.accessToken)
        navigate('/')
      } catch (error){
        console.log(error)
      }
    } 
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function isValidPassword(password) {
    return true;
  }


  return (
    <div class="container enter-container flex">
          <form class="container-login flex">
            <h2 class="login-title">
              Авторизация
            </h2>

            <ul class=" list-reset list-inputs">
              <li class="inputs-item flex">
                <p class="inputs-item-text">
                  ФИО
                </p>
                <input name='name' value={name} onChange={(e)=>{setName(e.target.value)}} class="inputs-item-input" type="text" />
              </li>

              <li class="inputs-item flex">
                <p class="inputs-item-text">
                  Почта
                </p>
                <input value={login} onChange={(e)=>{setLogin(e.target.value)}} class="inputs-item-input" type="email" />
              </li>

              <li class="inputs-item flex">
                <p class="inputs-item-text">
                  Пароль
                </p>
                <input value={password} onChange={(e)=>{setPassowrd(e.target.value)}} class="inputs-item-input" type="password" minlength="8" maxLength='16'/>
              </li>
            </ul>

            <div class="container-button-enter">
              <button onClick={()=>{onLogin()}} class="bth-enter" type="button">
                Войти
              </button>
            </div>
          </form>
        </div>
  );
}

export default Registration;
