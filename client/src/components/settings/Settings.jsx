import m from './settings.module.css';
import profile from "./../../img/avatar.png"

function Settings() {
  return (
    <main>
      <section className={m.profile_container}>
        <img className={m.profile_image} src={profile} alt="ProfileImage" />
        <section className={m.profile}>
          <h2 className={m.name}>Фамилия Имя Отчество</h2>
          <a className={m.login}>@lorem</a>
          <ul className={m.contact_list}>
            <li className={m.contact_list_item}>
              <a className={m.email} href="mailto:email@gmail.com">email@gmail.com</a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.phone} href="tel:+79120000000">8 (912) 000 00 00</a>
            </li>
            <li className={m.contact_list_item}>
              <a className={m.telegram}>@telegram</a>
            </li>
          </ul>
        </section>
      </section>
      <section className={m.profile_settings}>
        <h2 className={m.settings_main_text}>Основное</h2>
        <ul className={m.settings_list}>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>ФИО</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Логин</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Номер телефона</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Почта</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
        </ul>
      </section>
      <section className={m.profile_settings_more}>
        <h2 className={m.settings_main_text}>Дополнительно</h2>
        <ul className={m.settings_list}>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Расскажите о себе</h3>
            <textarea className={`${m.settings_text_input} ${m.large_setting}`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
              massa nunc. Suspendisse porta metus sed sem aliquam, vitae rutrum turpis
              maximus. Sed fermentum quis erat rhoncus rhoncus. Suspendisse dui.
            </textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Место работы / обучения</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
          <li className={m.settings_list_item}>
            <h3 className={m.settings_item}>Ссылка на соц. сети</h3>
            <textarea className={m.settings_text_input}>Lorem ipsum dolor</textarea>
          </li>
        </ul>
        <button className={m.save_settings}>Сохранить</button>
      </section>
    </main>
  );
}

export default Settings;
