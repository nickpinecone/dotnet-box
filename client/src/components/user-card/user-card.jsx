import m from './user-card.module.css';
import profile from "./../../img/avatar.png"

function UserCard({ userData }) {

  if (!userData) {
    return <>loading...</>
  }
  return (
    <main className={m.main}>
      <section className={m.profile_container}>
        <img className={m.profile_image} src={profile} alt={m.ProfileImage} />
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
