import { useState } from 'react';
import m from './recover-password.module.css'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { UrlServer } from "../../App"

function Recovery() {

  const params = useParams();
  const idUser = params.idUser;
  const token = params.token;
  const navigate = useNavigate()

  const [password, setPassowrd] = useState([])

  const onLogin = async () => {
    if (isValidPassword(password)) {
      try {
        const { data } = await axios.post(`http://${UrlServer()}/api/users/reset/${idUser}/${token}`, {
          password: password
        })
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  function isValidPassword(password) {
    return password.length >= 8;
  }

  return (
    <div className={m.enter_container}>
      <form className={m.container_login}>
        <h2 className={m.login_title}>Восстановление</h2>
        <p className={m.inputs_item_text}>Новый пароль</p>
        <input className={m.inputs_item_input} value={password} onChange={(e) => { setPassowrd(e.target.value) }} type="text" />
        <div className={m.container_button_enter}>
          <button class={m.bth_enter} onClick={() => { onLogin() }} type="button">Сохранить</button>
        </div>
      </form>
    </div>
  );
}

export default Recovery;
