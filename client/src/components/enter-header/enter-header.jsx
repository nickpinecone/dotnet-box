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
          <NavLink className={m.nav_link} to={'/'}>Главная</NavLink>
        </nav>
      </section>
    </header>
  );
}

export default EnterHeader;
