import { NavLink } from 'react-router-dom';
import m from './search.module.css';

function Search() {
  return (
    <section className={m.find_achiv}>
      <div className={m.find_flex_box}>
        <div className={`${m.find_blocks} ${m.left_find}`}>
          <p className={m.find_text}>Тема</p>
          <select className={m.find_choose}>
            <option></option>
            <option>Тема 1</option>
            <option>Тема 2</option>
            <option>Тема 3</option>
          </select>
        </div>
        <div className={m.find_blocks}>
          <p className={m.find_text}>Отсортировать по</p>
          <select className={m.find_choose}>
            <option></option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </div>
      </div>
      <p className={m.find_text}>Участник</p>
      <input className={m.find_member_achiv}></input>
      <NavLink className={m.search_achiv}>Найти</NavLink>
    </section >
  );
}

export default Search;
