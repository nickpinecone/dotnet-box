import m from './add-achievment.module.css';
import { NavLink } from 'react-router-dom';

function AddHeader() {
  return (
    <section className={m.achievments_header}>
      <section className={m.achievments_header_container}>
        <h1 className={m.achievments} href="#">Достижения</h1>
        <NavLink className={m.add} to="/add">Добавить достижение</NavLink>
      </section>
    </section>
  );
}

export default AddHeader;
