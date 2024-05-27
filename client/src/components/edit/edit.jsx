import m from './edit.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Edit({ dataCard, idAchieve }) {
  useEffect(() => {
    getData()
  }, [dataCard])

  const getData = () => {
    setName(dataCard.title)
    setDescr(dataCard.shortDescription)
    setAllDescr(dataCard.fullDescription)
    setLink(dataCard.url)
  }
  const [name, setName] = useState('')
  const [descr, setDescr] = useState('')
  const [allDescr, setAllDescr] = useState('')
  const [link, setLink] = useState('')
  const [img, setImg] = useState(null)

  const [people, setPeople] = useState('')

  const onEdit = async () => {
    try {
      let formData = new FormData();
      console.log(img)
      formData.append('title', name)
      formData.append('shortDescription', descr)
      formData.append('fullDescription', allDescr)
      formData.append('photo', img)
      formData.append('url', link)

      let members = localStorage.getItem('id')

      const { data } = await axios.put(`http://localhost:4000/api/portfolios/me/achievement/${idAchieve}`, formData,
        {
          params: { members },
          headers: { 'x-access-token': localStorage.getItem('token') },
        })
    }
    catch {
      console.log('Error edit-achieve')
    }
  }

  const AddPeople = async () => {
    const data = await axios.get('http://localhost:4000/api/users/byEmail', { email: people })
    console.log(data)
  }

  return (
    <div>
      <section className={m.add_achiv}>
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
            <p className={m.achiv_header_text}>Полное описание</p>
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
          <div className={m.button_sized}>
            <form className={m.add_photo}>
              <input className={m.add_photo_file} accept=".png,.jpg" onChange={(e) => { setImg(e.target.files[0]) }} type='file' />
              <span>Добавить фото</span>
            </form>
          </div>
          <div className={`${m.button_sized} ${m.button_corrected}`}><a className={m.confirm} href='/' onClick={() => { onEdit() }}>Подтердить подлинность</a></div>
          <div className={m.button_sized}><a className={m.publish} href='/' onClick={() => { onEdit() }}>Сохранить</a></div>
        </div>
      </section>
    </div>
  );
}

export default Edit;
