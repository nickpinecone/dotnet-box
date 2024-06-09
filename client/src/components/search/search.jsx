import { NavLink } from 'react-router-dom';
import m from './search.module.css';

function Search() {
  return (
    <section className={m.find_achiv}>
      <ul className={m.find}>
        <li className={m.find_item}>
          <p className={m.find_text}>Тема</p>
          <select className={m.find_choose}>
            <option></option>
            <option>Карточка человека</option>
            <option>Карточка достижения</option>
          </select>
        </li>
        <li className={m.find_item}>
          <p className={m.find_text}>Тип</p>
          <select className={m.find_choose}>
            <option></option>
            <option>Сертификат</option>
            <option>Проект</option>
            <option>Диплом</option>
            <option>Грамота</option>
          </select>
        </li>
        <li className={m.find_item}>
          <p className={m.find_text}>Отсортировать по</p>
          <select className={m.find_choose}>
            <option></option>
            <option>Спорт</option>
            <option>Музыка</option>
            <option>Наука</option>
            <option>Исскуство</option>
            <option>Информационные технологии</option>
            <option>Другое</option>
          </select>
        </li>
      </ul>
      <p className={m.find_text}>Участник</p>
      <input className={m.find_member_achiv}></input>
      <NavLink className={m.search_achiv}>Найти</NavLink>
    </section >
  );
}

export default Search;
