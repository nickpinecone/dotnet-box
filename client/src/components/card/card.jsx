import m from './card.module.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Card({ idUser, data, change}) {

  useEffect(() => {
    if (data.photo != undefined) {
      getPhoto()
    }

  }, [])

  const [photo, setPhoto] = useState()

  console.log(data)

  const getPhoto = async () => {
    const img = await axios.get(`http://localhost:4000/api/photos/${data.photo}`, { responseType: "blob" })
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
  }

  const delAchieve = async() => {
    const del = await axios.delete(`http://localhost:4000/api/portfolios/me/achievement/${data._id}`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
  }

  const changeCom = () => {
    if (change){
      return (
        <div className={m.chenge}>
          <div className={m.chenge_list}>
            <a className={m.chenge_list_item}>Редактировать</a>
            <a onClick={delAchieve} href='/' className={m.chenge_list_item}>Удалить</a>
          </div>
        </div>);
    }
    else{
      return ;
    }
  }

  return (
    <div className={m.achievment_container}>
      <img className={m.achievment_image} src={photo} alt="Achievment image" />
      <section className={m.achievment_words}>
        <h2 className={m.achievment_name}>{data.title}</h2>
        <h3 className={m.achievment_description}>Описание</h3>
        <p className={m.achievment_text}>{data.shortDescription}</p>
        <NavLink className={m.details} to={`/${idUser}/${data._id}`}>Подробнее</NavLink>
        {changeCom()}
      </section>
    </div >
  );
}

export default Card;
