import { NavLink } from 'react-router-dom';
import './Add.css';
import more from "./../../img/more.png"
import { useState } from 'react';
import axios from 'axios';

function Add() {
  const [type, setType] = useState('')
  const [name, setName] = useState('')
  const [descr, setDescr] = useState('')
  const [allDescr, setAllDescr] = useState('')
  const [link, setLink] = useState('')
  const [img, setImg] = useState(null)

  const onAdd = async() => {
      try {
        let formData = new FormData();
        console.log(img)
        formData.append('type', type)
        formData.append('title', name)
        formData.append('shortDescription', descr)
        formData.append('fullDescription', allDescr)
        formData.append('photo', img)

        const {data} = await axios.post('http://localhost:4000/api/portfolios/me/achievement', formData,
        {
          headers: { 'x-access-token' : localStorage.getItem('token')},
        })
      }
      catch {
        console.log("Error add-achieve")
      }
  }

  return (
    <section className='add-achiv'>
      <p className='achiv-header-text'>Тип достижения</p>
      <select value={type} onChange={(e)=>{setType(e.target.value)}} className='achiv-input-choose'>
        <option value="certificate">Сертификат</option>
        <option value="project">Проект</option>
      </select>

      <p className='achiv-header-text'>Название</p>
      <textarea value={name} onChange={(e)=>{setName(e.target.value)}} className='achiv-input achiv-input-name'></textarea>

      <p className='achiv-header-text'>Краткое описание</p>
      <textarea value={descr} onChange={(e)=>{setDescr(e.target.value)}} className='achiv-input achiv-description'></textarea>

      <p className='achiv-header-text'>Полное описание</p>
      <textarea value={allDescr} onChange={(e)=>{setAllDescr(e.target.value)}} className='achiv-input achiv-full-description'></textarea>

      <div className='centered-buttons'>
        <div className='button-sized button-corrected'>
          <p className="add-photo-text">Добавить фото</p>
          <input onChange={(e)=>{setImg(e.target.files[0])}} className='add-photo' type='file'/>
        </div>
        <div className='button-sized'><a className='publish' href="/" onClick={()=>{onAdd()}}>Опубликовать</a></div>
      </div>
    </section >
  );
}

export default Add;
