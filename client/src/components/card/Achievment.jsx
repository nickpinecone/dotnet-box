import './Achievment.css';
import image from "./../../img/achievment.png";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Achievment({data}) {

  useEffect(() =>{
    if (data.photo != undefined){
      getPhoto()
    }
   
  }, [])

  const [photo, setPhoto] = useState()

  const getPhoto = async() => {
    const img = await axios.get(`http://localhost:4000/api/photos/${data.photo}`, {responseType: "blob"})
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
  }

  return (
    <main>
      <section className="achievment-container">
        <img className="achievment-image" src={photo} alt="Achievment image" />
        <section className="achievment-words">
          <h2 className="achievment-name">{data.title}</h2>
          <h3 className="achievment-description">{data.shortDescription}</h3>
          <p className="achievment-text">
            {data.fullDescription}
          </p>
          <NavLink className="details" to={`/${data.portfolio}/${data._id}`}>Подробнее</NavLink>
        </section>
      </section>
    </main>
  );
}

export default Achievment;
