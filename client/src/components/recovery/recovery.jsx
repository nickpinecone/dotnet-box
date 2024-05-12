import { useState } from 'react';
import m from './recovery.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Recovery() {

  const navigate = useNavigate()

  const [login, setLogin] = useState('')

  const onLogin = async () => {
    if (isValidEmail(login)) {
      try {
        const { data } = await axios.post('http://localhost:4000/api/users/reset', {
          email: login
        })
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  return (
    <div className={m.enter_container}>
      <form className={m.container_login}>
        <h2 className={m.login_title}>Восстановление</h2>
        <p className={m.inputs_item_text}>Почта</p>
        <input className={m.inputs_item_input} value={login} onChange={(e) => { setLogin(e.target.value) }} type="text" />
        <div className={m.container_button_enter}>
          <button class={m.bth_enter} onClick={() => { onLogin() }} type="button">Отправить письмо</button>
        </div>
      </form>
    </div>
  );
}

export default Recovery;
