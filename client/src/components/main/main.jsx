import m from './main.module.css';
import { NavLink } from 'react-router-dom';
import man from '../../img/5388563362240022086 1.png'
import axios from 'axios';
import { useEffect, useState } from 'react';

function Main() {
  return <main>
    <section className={m.registration}>
      <div className={m.headers}>
        <h2 className={m.h1}>Создай цифровое портфолио</h2>
        <h3 className={m.h2}>Делись опытом, знаниями, успехами. Узнавай новое, чтобы стать лучше</h3>
        <NavLink className={m.button} to='/registration'></NavLink>
      </div>
      <img className={m.achievment_image} src={man} alt="man" />
    </section>
    <p className={m.achievment_text}></p>
  </main>
}

export default Main;
