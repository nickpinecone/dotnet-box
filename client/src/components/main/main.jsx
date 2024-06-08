import m from './main.module.css';
import { NavLink } from 'react-router-dom';
import man from '../../img/5388563362240022086 1.png';
import a from '../../img/icon-metrics-01 1.png';
import b from '../../img/image 12.png';
import c from '../../img/image 13.png';
import d from '../../img/Social Icons.png';

function Main() {
  return (
    <main>
      <section className={m.registration}>
        <div className={m.headers}>
          <h2 className={m.h1}>Создай цифровое портфолио</h2>
          <h3 className={m.h2}>Делись опытом, знаниями, успехами. Узнавай новое, чтобы стать лучше</h3>
          <NavLink className={m.register} to='/registration'>Регистрация</NavLink>
        </div>
        <img className={m.img} src={man} alt="man" />
      </section>
      <section className={m.us}>
        <h3>О нас</h3>
        <p className={m.mission}>
          Наша миссия - вдохновлять людей и помогать им достигать новых высот. Мы создали
          универсальную платформу, где каждый может поделиться своими достижениями и
          вдохновиться успехами других.
        </p>
        <p>
          Присоединяйтесь к нашему сообществу вдохновленных людей и станьте ближе к своей
          мечте. Вместе мы сможем многого достичь!
        </p>
      </section>
      <section className={m.advantages}>
        <h3>Преимущества</h3>
        <ul className={m.list}>
          <li className={m.item}>
            <img src={a} alt="picture" />
            <h4>Подборка лучших достижений</h4>
          </li>
          <li className={m.item}>
            <img src={b} alt="picture" />
            <h4>Помощь в реализации понравившегося достижения</h4>
          </li>
          <li className={m.item}>
            <img src={c} alt="picture" />
            <h4>История достижения</h4>
          </li>
          <li className={m.item}>
            <img src={d} alt="picture" />
            <h4>Авторизация через ВКонтакте</h4>
          </li>
        </ul>
      </section>
      <h2 className={m.achievments}>Достижения</h2>
    </main>
  );
}

export default Main;
