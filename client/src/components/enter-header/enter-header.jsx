import m from './enter-header.module.css';
import logo from "./../../img/logo.svg";
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

function EnterHeader() {
  const [inAccaunt, setInAccaunt] = useState(false)

  useEffect(() => {
    if(localStorage.getItem("token")){
      setInAccaunt(true)
    }
  }, [])

  const viewInAccount = () => {
    if(!inAccaunt) {
      return (<li className={m.site_navigation_item}>
        <NavLink className={m.buttons} to="/login">Вход</NavLink>
      </li>)
    }
  }

  const viewRegistInAccount = () => {
    if(!inAccaunt) {
      return (
      <li className={m.site_navigation_item}>
        <NavLink className={m.buttons} to="/registration">Регистрация</NavLink>
      </li>)
    }
  }

  const viewMyAccount = () => {
    if(inAccaunt) {
      return (
        <li className={m.site_navigation_item}>
        <NavLink className={m.buttons} to="/myPortfolio">Моё портфолио</NavLink>
      </li>)
    }
  }

  return (
    <header className={m.header}>
      <section className={m.header_container}>
        <NavLink className={m.logo_link} to={'/'}>
          <img className={m.logo} src={logo} alt='Logo' />
        </NavLink>
        <nav className={m.header_nav}>
          <ul className={m.site_navigation}>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">О нас</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/">Преимущества</NavLink>
            </li>
            <li className={m.site_navigation_item}>
              <NavLink className={m.nav_link} to="/search">Достижения</NavLink>
            </li>
            {viewInAccount()}
            {viewRegistInAccount()}
            {viewMyAccount()}
          </ul>
        </nav>
      </section>
    </header>
  );
}

export default EnterHeader;
