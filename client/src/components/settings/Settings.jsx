import m from './settings.module.css';
import profile from "./../../img/avatar.png"
import download from '../../img/download.svg'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Settings({userData, photo}) {

  const [img, setImg] = useState()
  const [avatar, setAvatar] = useState()

  const onUpdate = async() => {
    try {
      let formData = new FormData();
      formData.append('avatar', img)
      const { data } = await axios.put('http://localhost:4000/api/users/me', formData,
        {
          headers: { 'x-access-token': localStorage.getItem('token') },
        })
    }
    catch {
      console.log('Error update-achieve')
    }
  }

  return (
    <main>
      <section className={m.profile_container}>
        <div className={m.profile_img}> 
          <img className={m.profile_image} src={photo} alt="ProfileImage" />
          <img className={m.profile_image_dowload} src={download} alt="ProfileImage" />
          <input className={m.profile_input_img} type="file" accept=".png,.jpg" onChange={(e) => { setImg(e.target.files[0])}}/>
        </div>

        <section className={m.profile}>
          <h2 className={m.name}>{userData.name} {userData.surname}</h2>
          <a className={m.login}>{userData._id}</a>
          <ul className={m.contact_list}>
            <li className={m.contact_list_item}>
              <a className={m.email} href={`mailto:${userData.email}`}>{userData.email}</a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.phone} href="tel:+79120000000"></a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.telegram}></a>
            </li>
          </ul>
        </section>
      </section>

      <section className={m.profile_settings}>
        <h2 className={m.settings_main_text}>Основное</h2>
        <ul className={m.settings_list}>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>ФИО</h3>
            <textarea className={m.settings_text_input} placeholder={`${userData.name} ${userData.surname}`}></textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Логин</h3>
            <textarea className={m.settings_text_input} placeholder={userData._id}></textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Номер телефона</h3>
            <textarea className={m.settings_text_input} placeholder='8 (912) 000 00 00'></textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Почта</h3>
            <textarea className={m.settings_text_input} placeholder='test@gmail.com'></textarea>
          </li>
        </ul>
      </section>
      <section className={m.profile_settings_more}>
        <h2 className={m.settings_main_text}>Дополнительно</h2>
        <ul className={m.settings_list}>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Расскажите о себе</h3>
            <textarea className={`${m.settings_text_input} ${m.large_setting}`} placeholder='Расскажите о себе'></textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Место работы / обучения</h3>
            <textarea className={m.settings_text_input} placeholder='Место работы / обучения'></textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Ссылка на соц. сети</h3>
            <textarea className={m.settings_text_input} placeholder='@telegram'></textarea>
          </li>
        </ul>
        <button className={m.save_settings} onClick={() => { onUpdate() }}>Сохранить</button>
      </section>
    </main>
  );
}

export default Settings;
