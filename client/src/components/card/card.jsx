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
    const img = await axios.get(`http://localhost:4000/api/photos/${data.photo}`, { responseType: "blob" })
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
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
    if(data.likeAmount){
      return <NavLink className={m.like} onClick={PutLike}>{data.likeAmount}</NavLink>
    }
    else{
      return <NavLink className={m.like} onClick={PutLike}>0</NavLink>
    }
  }

  const PutLike = async() => {
    const { data } = await axios.put(`http://localhost:4000/api/portfolios/me/achievement/like/${data._id}`,{} , {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
  }

  const linkTo = () => {
    if (idUser === null) {
      return <div className={m.flex}>
        <NavLink className={m.details}>Подробнее</NavLink>
        {ViewLike()}
        </div>
    }
    else {
      return <div className={m.flex}>
        <NavLink className={m.details} to={`/${idUser}/${data._id}`}>Подробнее</NavLink>
        {ViewLike()}
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
    </div >
  );
}

export default Card;
