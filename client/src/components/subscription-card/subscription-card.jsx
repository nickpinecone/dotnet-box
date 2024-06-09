import m from './subscription-card.module.css';
import profile from "./../../img/avatar.png"
import { useEffect, useState } from 'react';
import axios from "axios";

function SubscriptionCard({ userData }) {
  const [photo, setPhoto] = useState()

  useEffect(() => {
    if(userData){
      getPhoto(userData)
    }
    
  }, []);

  const getPhoto = async (info) => {
    if (info.avatar) {
      const img = await axios.get(`http://localhost:4000/api/photos/${info.avatar}`, { responseType: "blob" })
      let url = URL.createObjectURL(img.data)
      setPhoto(url)
    }
    else {
      setPhoto(profile)
    }
  }

  return (
    <div className={m.card}>
      <section className={m.element}>
        <img className={m.picture} src={photo} />
        <div className={m.text}>
          <p className={m.text_title}>{userData.name} {userData.surname}</p>
          <p>Всем привет! Люблю занималься аналитикой!</p>
        </div>
        <a className={m.unsubscribe}>Отписаться</a>
      </section>
    </div>
  );
}

export default SubscriptionCard;
