import './add.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="achievments-header">
        <section className="achievments-header-container">
          <h1 className="achievments" href="#">Достижения</h1>
          <Link className="add" to="/add">Добавить достижение</Link>
        </section>
      </div>
  );
}

export default Header;