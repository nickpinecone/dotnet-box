import m from './settings.module.css';
import profile from "./../../img/avatar.png"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Settings() {

  const navigate = useNavigate()

  useEffect(() => {
    try {
      if (localStorage.getItem('token')) {
        handleGetData()
      }
      else {
        navigate('/login')
      }
    }
    catch {
      navigate('/login')
    }
  }, []);

  const [userData, setDataPeple] = useState([])

  const handleGetData = async () => {
    const { data } = await axios.get('http://localhost:4000/api/users/me', {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    setDataPeple(data)
    console.log(data)
  }

  return (
    <main>
      <section className={m.profile_container}>
        <img className={m.profile_image} src={profile} alt="ProfileImage" />
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
        <button className={m.save_settings}>Сохранить</button>
      </section>
    </main>
  );
}

export default Settings;
