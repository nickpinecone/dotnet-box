import './header.css';
import logo from "../../img/logo.svg";
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header class="header">
    <div class="header-container flex">
      <Link to='/login' class="logo-link">
        <img class="image-logo" src={logo} alt="Logo" />
      </Link>
      <nav class="list-reset header-nav flex">
        <li class="site-navigation-item">
            <Link to='/' class="nav-link" >Главная</Link>
        </li>

        <li class="site-navigation-item">
            <Link to='/find' class="nav-link">Поиск</Link>
        </li>

        <li class="site-navigation-item">
            <Link to="/setting" class="nav-link">Настройки профиля</Link>
        </li>
      </nav>
    </div>
  </header>
  );
}

export default Header;