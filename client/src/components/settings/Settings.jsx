import './Settings.css';
import profile from "./../../img/avatar.png"

function Settings() {
  return (
    <main>
      <section className="profile-container">
        <img className="profile-image" src={profile} alt="ProfileImage" />
        <section className="profile">
          <h2 className="name">Фамилия Имя Отчество</h2>
          <a className="login">@lorem</a>
          <ul className="contact-list">
            <li className="contact-list-item">
              <a className="email" href="mailto:email@gmail.com">email@gmail.com</a>
            </li>
            <li className="contact-list-item">
              <a className="phone" href="tel:+79120000000">8 (912) 000 00 00</a>
            </li>
            <li className="contact-list-item">
              <a className="telegram">@telegram</a>
            </li>
          </ul>
        </section>
      </section>
      <section className='profile-settings'>
        <h2 className="settings-main-text">Основное</h2>
        <ul className='settings-list'>
          <li className='settings-list-item'>
            <h3 className='settings-item'>ФИО</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Логин</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Номер телефона</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Почта</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
        </ul>
      </section>
      <section className='profile-settings-more'>
        <h2 className="settings-main-text">Дополнительно</h2>
        <ul className='settings-list'>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Расскажите о себе</h3>
            <textarea className="settings-text-input large-setting">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
              massa nunc. Suspendisse porta metus sed sem aliquam, vitae rutrum turpis
              maximus. Sed fermentum quis erat rhoncus rhoncus. Suspendisse dui.
            </textarea>
          </li>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Место работы / обучения</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
          <li className='settings-list-item'>
            <h3 className='settings-item'>Ссылка на соц. сети</h3>
            <textarea className="settings-text-input">Lorem ipsum dolor</textarea>
          </li>
        </ul>
        <button className='save-settings'>Сохранить</button>
      </section>
    </main>
  );
}

export default Settings;
