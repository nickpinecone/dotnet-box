import m from './header.module.css';
import logo from "./../../img/logo.svg"
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className={m.header}>
      <section className={m.header_container}>
        <NavLink className={m.logo_link} to="/">
          <img className={m.logo} src={logo} alt="Logo" />
        </NavLink>
        <nav className={m.header_nav}>
          <ul className={m.site_navigation}>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">Главная</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/search">Поиск</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/settings">Настройки профиля</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/subscriptions">Подписки</NavLink>
            </li>
          </ul>
        </nav>
      </section>
    </header>
  );
}

export default Header;
