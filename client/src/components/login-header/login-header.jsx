import './login-header.css';
import logo from "../../img/logo.svg";
import { Link } from 'react-router-dom';

function Loginheader() {
  return (
    <header class="header">
    <div class="header-container flex">
      <Link class="logo-link">
        <img class="image-logo" src={logo} alt="Logo" />
      </Link>
      <nav class="header-nav">
        <Link to={'/login'}  class="nav-link">
          Главная
        </Link>
      </nav>
    </div>
  </header>
  );
}

export default Loginheader;
