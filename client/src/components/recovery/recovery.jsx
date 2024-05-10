import { useState } from 'react';
import m from './recovery.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Recovery() {

  return (
    <div className={m.enter_container}>
      <form className={m.container_login}>
        <h2 className={m.login_title}>Восстановление</h2>
        <p className={m.inputs_item_text}>Почта</p>
        <input className={m.inputs_item_input} onChange type="text" />
        <div className={m.container_button_enter}>
          <button class={m.bth_enter} onClick type="button">Отправить письмо</button>
        </div>
      </form>
    </div>
  );
}

export default Recovery;
