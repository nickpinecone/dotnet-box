import m from './card.module.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Card({ data }) {

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

  return (
    <div className={m.achievment_container}>
      <img className={m.achievment_image} src={photo} alt="Achievment image" />
      <section className={m.achievment_words}>
        <h2 className={m.achievment_name}>{data.title}</h2>
        <h3 className={m.achievment_description}>{data.shortDescription}</h3>
        <p className={m.achievment_text}>{data.fullDescription}</p>
        <NavLink className={m.details} to={`/${data.portfolio}/${data._id}`}>Подробнее</NavLink>
      </section>
    </div >
  );
}

export default Card;
