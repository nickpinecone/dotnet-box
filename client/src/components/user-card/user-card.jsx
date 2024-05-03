import m from './user-card.module.css';
import profile from "./../../img/avatar.png"
import { Link, NavLink } from 'react-router-dom';

function UserCard({ userData }) {

  if (!userData) {
    return <>loading...</>
  }
  return (
    <main className={m.main}>
      <section className={m.profile_container}>
        <NavLink className={m.back} to='/login'>Назад</NavLink>
        <img className={m.profile_image} src={profile} alt={profile} />
        <section className={m.profile}>
          <h2 className={m.name}>{userData.name} {userData.surname}</h2>
          <a className={m.login}>{userData._id}</a>
          <ul className={m.contact_list}>
            <li className={m.contact_list_item}>
              <a className={m.email} href={`mailto:${userData.email}`}>{userData.email}</a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.phone} href="tel:+79120000000">8 (912) 000 00 00</a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.telegram}>@telegram</a>
            </li>
            <li className={`${m.contact_list_item} ${m.buttons}`}>
              <Link className={m.subscribe}>Подписаться</Link>
              <Link className={m.unsubscribe}>Отписаться</Link>
            </li>
          </ul>
        </section>
      </section>
      <section className={m.description}>
        <h3 className={m.about_me}>О себе</h3>
        <p className={m.text_about_me}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
          massa nunc. Suspendisse porta metus sed sem aliquam, vitae rutrum turpis
          maximus. Sed fermentum quis erat rhoncus rhoncus. Suspendisse dui.
        </p>
      </section>
    </main>
  );
}

export default UserCard;
