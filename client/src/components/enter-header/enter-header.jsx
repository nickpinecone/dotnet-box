import m from './enter-header.module.css';
import logo from "./../../img/logo.svg";
import { NavLink } from 'react-router-dom';

function EnterHeader() {
  return (
    <header className={m.header}>
      <section className={m.header_container}>
        <NavLink className={m.logo_link} to={'/login'}>
          <img className={m.logo} src={logo} alt='Logo' />
        </NavLink>
        <nav className={m.header_nav}>
          <ul className={m.site_navigation}>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">Главная</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">О нас</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">Преимущества</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/search">Достижения</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.buttons} to="/login">Вход</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.buttons} to="/registration">Регистрация</NavLink>
            </li>
          </ul>
        </nav>
      </section>
    </header>
  );
}

export default EnterHeader;
