import m from './add-achievment.module.css';
import { NavLink } from 'react-router-dom';

function AddHeader({ isAdd }) {
  const add = () => {
    if (isAdd) {
      return <NavLink className={m.add} to="/add">Добавить достижение</NavLink>
    }
  }

  return (
    <section className={m.achievments_header}>
      <section className={m.achievments_header_container}>
        <h1 className={m.achievments} href="#">Достижения</h1>
        {add()}
      </section>
    </section>
  );
}

export default AddHeader;
