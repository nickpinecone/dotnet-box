import m from './card.module.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Card({ idUser, data, change, img }) {
  console.log(data)
  useEffect(() => {
    if (data.photo != undefined) {
      getPhoto()
    }
  }, [])

  const [photo, setPhoto] = useState()

  const getPhoto = async () => {
    const img = await axios.get(`http://localhost:4000/api/content/photo/${data.photo}`, { responseType: "blob" })
    setPhoto(URL.createObjectURL(img.data))
  }

  const delAchieve = async () => {
    const del = await axios.delete(`http://localhost:4000/api/portfolios/me/achievement/${data._id}`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
  }

  const changeCom = () => {
    if (change) {
      return (
        <div className={m.change}>
          <div className={m.change_list}>
            <NavLink className={m.change_list_item} to={`/${idUser}/${data._id}/edit`}>Редактировать</NavLink>
            <NavLink onClick={delAchieve} href='/' className={m.change_list_item}>Удалить</NavLink>
          </div>
        </div>);
    }
    else {
      return;
    }
  }

  const ViewLike = () => {
    return <NavLink className={m.like} onClick={PutLike}></NavLink>
  }

  const ViewCounter = () => {
    return <span className={m.counter}>{data.likeAmount ? data.likeAmount : 0}</span>
  }

  const PutLike = async () => {
    const { like } = await axios.put(`http://localhost:4000/api/portfolios/me/achievement/like/${data._id}`, {}, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
  }

  const linkTo = () => {
    if (idUser === null) {
      return <div className={m.flex}>
        <NavLink className={m.details}>Подробнее</NavLink>
        {ViewLike()}
        {ViewCounter()}
      </div>
    }
    else {
      return <div className={m.flex}>
        <NavLink className={m.details} to={`/${idUser}/${data._id}`}>Подробнее</NavLink>
        {ViewLike()}
        {ViewCounter()}
      </div>
    }
  }

  return (
    <div className={m.achievment_container}>
      <img className={m.achievment_image} src={photo} alt="Achievment image" />
      <section className={m.achievment_words}>
        <h2 className={m.achievment_name}>{data.title}</h2>
        <h3 className={m.achievment_description}>Описание</h3>
        <p className={m.achievment_text}>{data.shortDescription}</p>
        {linkTo()}
        {changeCom()}
      </section>
    </div>
  );
}

export default Card;
