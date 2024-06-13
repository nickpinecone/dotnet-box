import { Link } from 'react-router-dom';
import m from './search.module.css';
import { useEffect, useState } from 'react';
import { UrlServer } from '../../App';
import Card from '../card/card';
import axios from 'axios';

export function Search() {
  const [tema, setTema] = useState()
  const [tip, setTip] = useState()
  const [sort, setSort] = useState()
  const [person, setPerson] = useState()
  const [data, setData] = useState([])

  useEffect(() => {
    getAchieve()
  }, [])

  const getAchieve = async () => {
    const dataUsers = await axios.get(`http://${UrlServer()}/api/portfolios/search`)
    setData(dataUsers.data)
  }

  const Find = async () => {
    console.log(tema, tip, sort, person);
    let query = "";
    let limit = "";
    let theme = sort;
    let type = "";
    const { data } = await axios.get(`http://${UrlServer()}/api/portfolios/search`, { params: { theme } })
    setData(data)
  }

  return (
    <div>
      <section className={m.find_achiv}>
        <ul className={m.find}>
          <li className={m.find_item}>
            <p className={m.find_text}>Вид</p>
            <select className={m.find_choose} value={tema} onChange={(e) => { setTema(e.target.value) }}>
              <option>-- выбрать --</option>
              <option>Карточка достижения</option>
              <option>Карточка человека</option>
            </select>
          </li>
          <li className={m.find_item}>
            <p className={m.find_text}>Тип</p>
            <select className={m.find_choose} value={tip} onChange={(e) => { setTip(e.target.value) }}>
              <option>-- выбрать --</option>
              <option>Сертификат</option>
              <option>Проект</option>
              <option>Диплом</option>
              <option>Грамота</option>
            </select>
          </li>
          <li className={m.find_item}>
            <p className={m.find_text}>Тематика</p>
            <select className={m.find_choose} value={sort} onChange={(e) => { setSort(e.target.value) }}>
              <option>-- выбрать --</option>
              <option value="спорт">Спорт</option>
              <option>Музыка</option>
              <option value="наука">Наука</option>
              <option>Исскуство</option>
              <option>Информационные технологии</option>
              <option>Другое</option>
            </select>
          </li>
        </ul>
        <p className={m.find_text}>Участник</p>
        <input className={m.find_member_achiv} value={person} onChange={(e) => { setPerson(e.target.value) }}></input>
        <Link className={m.search_achiv} onClick={Find}>Найти</Link>
      </section >
      <FindCards data={data} />
    </div>

  );
}

export function FindCards({ data }) {

  return (
    <div>
      {data.map(achiv => <Card data={achiv} />)}
    </div>
  )
}

export default Search;
