import m from './enter-header.module.css';
import logo from "./../../img/logo.svg";
import { Link } from 'react-router-dom';
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
        <Link className={m.buttons} to="/login">Вход</Link>
      </li>)
    }
  }

  const viewRegistInAccount = () => {
    if(!inAccaunt) {
      return (
      <li className={m.site_navigation_item}>
        <Link className={m.buttons} to="/registration">Регистрация</Link>
      </li>)
    }
  }

  const viewMyAccount = () => {
    if(inAccaunt) {
      return (
        <li className={m.site_navigation_item}>
        <Link className={m.buttons} to="/myPortfolio">Моё портфолио</Link>
      </li>)
    }
  }

  return (
    <header className={m.header}>
      <section className={m.header_container}>
        <Link className={m.logo_link} to={'/'}>
          <img className={m.logo} src={logo} alt='Logo' />
        </Link>
        <nav className={m.header_nav}>
          <ul className={m.site_navigation}>
            <li className={m.site_navigation_item}>
              <a className={m.nav_link} >О нас</a>
            </li>
            <li className={m.site_navigation_item}>
              <a className={m.nav_link} >Преимущества</a>
            </li>
            <li className={m.site_navigation_item}>
              <a className={m.nav_link} >Достижения</a>
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
