import m from './add.module.css';
import Card from '../card/card';
import BigCard from '../big-card/big-card';
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UrlServer } from "../../App"

function Add() {

  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [descr, setDescr] = useState('')
  const [allDescr, setAllDescr] = useState('')
  const [link, setLink] = useState('')
  const [img, setImg] = useState(null)
  const [files, setFiles] = useState([]);
  const [members, setMemebers] = useState([localStorage.getItem('id')])

  const [people, setPeople] = useState('')

  const onAdd = async () => {
    try {
      let formData = new FormData();
      formData.append('type', type)
      formData.append('title', name)
      formData.append('shortDescription', descr)
      formData.append('fullDescription', allDescr)
      formData.append('photo', img)
      formData.append('url', link)
      for(let file of files){
        formData.append('files', file)
      }
      formData.append('theme', "спорт")
      console.log(formData)

      let members = localStorage.getItem('id')

      const { data } = await axios.post(`http://${UrlServer()}/api/portfolios/me/achievement`, formData,
        {
          params: { members },
          headers: { 'x-access-token': localStorage.getItem('token') },
        })
    }
    catch {
      console.log('Error add-achieve')
    }
  }

  const viewAchieve = () => {
    for(let file of files){
      console.log(file.type)
    }
    let url = null;
    if(img !== null && img !== undefined){
      url = URL.createObjectURL(img)
    }
    const dataAchieve = { "type": type, 'title': name, 'shortDescription': descr, 'fullDescription': allDescr, 'url': link, "members": members }
    return (
      <div>
        <BigCard dataCard={dataAchieve} fromAdd={true} photo={url}/>
      </div>
    )
  }

  const AddPeople = async () => {
    console.log(people)
    
    const { data } = await axios.get(`http://${UrlServer()}/api/users/byEmail`, {'email': people})
  }

  return (
    <div>
      <section className={m.add_achiv}>
        <p className={m.achiv_header_text}>Тип достижения</p>
        <select className={m.achiv_input_choose} value={type} onChange={(e) => { setType(e.target.value) }}>
          <option className={m.achiv_input_choose_option} value='certificate'>Сертификат / диплом</option>
          <option value='project'>Проект</option>
        </select>

        <ul className={m.list}>
          <li>
            <p className={m.achiv_header_text}>Название</p>
            <input className={`${m.achiv_input} ${m.achiv_input_short}`} value={name} onChange={(e) => { setName(e.target.value) }}></input>
          </li>
          <li>
            <p className={m.achiv_header_text}>Краткое описание</p>
            <textarea className={`${m.achiv_input} ${m.achiv_description}`} value={descr} onChange={(e) => { setDescr(e.target.value) }}></textarea>
          </li>
          <li>
            <p className={m.achiv_header_text}>История</p>
            <textarea className={`${m.achiv_input} ${m.achiv_full_description}`} value={allDescr} onChange={(e) => { setAllDescr(e.target.value) }}></textarea>
          </li>
          <li>
            <p className={m.achiv_header_text}>Ссылка на достижение</p>
            <input className={`${m.achiv_input} ${m.achiv_input_short}`} value={link} onChange={(e) => { setLink(e.target.value) }}></input>
          </li>
          <li>
            <p className={m.achiv_header_text}>Участники</p>
            <div className={m.achiv_input_people}>
              <input className={`${m.achiv_input} ${m.achiv_input_short}`} value={people} onChange={(e) => { setPeople(e.target.value) }}></input>
              <div className={m.button_sized}><Link className={m.publish} onClick={() => { AddPeople() }}>Добавить</Link></div>
            </div>
          </li>
        </ul>
        

        <div className={m.centered_buttons}>
          <div className={m.buttons_add}>
            <form className={m.add_photo}>
              <input className={m.add_photo_file} accept=".png,.jpg" onChange={(e) => { setImg(e.target.files[0]) }} type='file' />
              <span>Добавить фото</span>
            </form>

            <form className={m.add_photo}>
              <input className={m.add_photo_file} onChange={(e) => { setFiles(e.target.files) }} multiple="multiple" type='file' />
              <span>Добавить файлы</span>
            </form>
          </div>
          <div className={m.button_sized}><a className={m.publish} href='#/myPortfolio' onClick={() => { onAdd() }}>Опубликовать</a></div>
        </div>
      </section>
      {viewAchieve()}
    </div>
  );
}

export default Add;
