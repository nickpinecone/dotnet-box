import { NavLink } from 'react-router-dom';
import './Find.css';
import more from "./../../img/more.png"

function Find() {
  return (
    <section className='find-achiv'>
      <div className='find-flex-box'>
        <div className='find-blocks left-find'>
          <p className='find-text'>Тема</p>
          <select className='find-choose'>
            <option value=""></option>
          </select>
        </div>
        <div className='find-blocks'>
          <p className='find-text'>Отсортировать по</p>
          <select className='find-choose'>
            <option value=""></option>
          </select>
        </div>
      </div>
      <p className='find-text'>Участник</p>
      <textarea className='find-member-achiv'></textarea>
      <NavLink className='search-achiv'>Найти</NavLink>
    </section >
  );
}

export default Find;
