import m from './user-card.module.css';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

function UserCard({ userData, photo }) {

  let isMy = () => {
    return userData._id === localStorage.getItem("id")
  }
  const back = () => {
    if(!isMy()) {
      return <NavLink className={m.back} to={-1}>Назад</NavLink>
    }
  }

  const sub = () => {
    if(!isMy()) {
      return (
        <li className={`${m.contact_list_item} ${m.buttons}`}>
          <Link className={m.subscribe}>Подписаться</Link>
          <Link className={m.unsubscribe}>Отписаться</Link>
        </li>
      )
    }
  }

  if (!userData) {
    return <>loading...</>
  }
  return (
    <main className={m.main}>
      <section className={m.profile_container}>
        {back()}
        <img className={m.profile_image} src={photo} alt="avatar"/>
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
            {sub()}
          </ul>
        </section>
      </section>
      <section className={m.description}>
        <h3 className={m.about_me}>О себе</h3>
        <p className={m.text_about_me}>
          Привет! Я только зарегистрировался
        </p>
      </section>
    </main>
  );
}

export default UserCard;
