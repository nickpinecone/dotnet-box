import { Link } from 'react-router-dom';
import m from './search.module.css';
import { useEffect, useState } from 'react';
import { UrlServer } from '../../App';
import Card from '../card/card';
import axios from 'axios';
import More from '../more/more'

export function Search() {
  const [tema, setTema] = useState("achive")
  const [tip, setTip] = useState()
  const [sort, setSort] = useState()
  const [person, setPerson] = useState()
  const [data, setData] = useState([])
  const [lim, setLimit] = useState(3)

  const [listSort, setListSort] = useState([]) 
  const getListSort = async() => {
    setListSort([])
    const {data} = await axios.get(`http://${UrlServer()}/api/content/data/`)
    setListSort(data)
  }
  
  const viewOption = (data) => {
    const list = [];
    for(let cat in data){
      list.push(data[cat])
    }
    return list.map(ct => <option>{ct}</option>)
  }

  useEffect(() => {
    getAchieve()
    getListSort()
  }, [])

  const getAchieve = async () => {
    const dataUsers = await axios.get(`http://${UrlServer()}/api/portfolios/search`)
    setData(dataUsers.data)
  }

  const Find = async () => {
    let query;
    let limit = lim;
    let theme = sort;
    let type = tip;

    console.log(tema, tip, sort, person);
    
    const { data } = await axios.get(`http://${UrlServer()}/api/portfolios/search`, { params: { theme, type, limit } })
    setData(data)
  }


  return (
    <div>
      <section className={m.find_achiv}>
        <ul className={m.find}>
          <li className={m.find_item}>
            <p className={m.find_text}>Вид</p>
            <select className={m.find_choose} value={tema} onChange={(e) => { setTema(e.target.value) }}>
              {viewOption(listSort.categories)}
            </select>
          </li>
          <li className={m.find_item}>
            <p className={m.find_text}>Тип</p>
            <select className={m.find_choose} value={tip} onChange={(e) => { setTip(e.target.value) }}>
              {viewOption(listSort.types)}
            </select>
          </li>
          <li className={m.find_item}>
            <p className={m.find_text}>Тематика</p>
            <select className={m.find_choose} value={sort} onChange={(e) => { setSort(e.target.value) }}>
              {viewOption(listSort.themes)}
            </select>
          </li>
        </ul>
        <p className={m.find_text}>Участник</p>
        <input className={m.find_member_achiv} value={person} onChange={(e) => { setPerson(e.target.value) }}></input>
        <Link className={m.search_achiv} onClick={Find}>Найти</Link>
      </section >
      <FindCards data={data} />
      <Link className={m.btn__more} onClick={() => {setLimit(lim+3); Find()}}>Показать ещё</Link>
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
