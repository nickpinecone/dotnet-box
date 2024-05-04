import m from './big-card.module.css';
import people from "./../../img/people.png"
import achievment from "./../../img/achievment.png"
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function BigCard({ data, photo}) {

  return (
    <main className={m.main}>
      <section className={m.container}>
        <div className={m.container_big_card_achiv}>
          <NavLink className={m.link_exit} to={-1} >Назад</NavLink>
          <div className={m.big_card_achiv_main_information}>
            <div className={m.achiv_top}>
              <div className={m.achiv_top_main_info}>
                <img className={m.image_achiv} src={photo} alt="achievment" />
                <div className={m.achiv_top_main_info_text}>
                  <h2 className={m.achiv_title}>{data.title}</h2>
                  <p className={m.achiv_descr_title}>Описание</p>
                  <p className={m.achiv_descr_text}>{data.shortDescription}</p>
                  <button className={m.btn_like} type="button">Понравилось</button>
                </div>
              </div>
              <div className={m.achiv_top_add_info}>
                <ul className={m.achiv_top_add_info_list}>
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>Подробное описание</p>
                    <p className={m.achiv_descr_text}>{data.fullDescription}</p>
                  </li>
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>Ссылки</p>
                    <p className={m.achiv_descr_text}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc. Suspendisse porta
                      metus sed sem aliquam, vitae rutrum turpis  maximus. Sed fermentum quis erat rhoncus rhoncus.
                      Suspendisse dui.
                    </p>
                  </li>
                  <li className={m.achiv_top_add_info_item}>
                    <p className={m.achiv_descr_title}>Участники</p>
                    <img className={m.big_card_image_people} src={people} alt="Фото участника" />
                    <img className={m.big_card_image_people} src={people} alt="Фото участника" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={m.achiv_comment}>
            <h2 className={m.achiv_comment_title}>Комментарии</h2>
            <ul className={m.achiv_comment_list}>
              <li className={m.achiv_comment_item}>
                <img className={m.achiv_comment_item_image} src={people} alt="user" />
                <p className={m.achiv_comment_item_text}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc.
                  Suspendisse porta metus sed sem aliquam, vitae rutrum turpis  maximus. Sed
                  fermentum quis erat rhoncus rhoncus. Suspendisse dui.
                </p>
              </li>
              <li className={m.achiv_comment_item}>
                <img className={m.achiv_comment_item_image} src={people} alt="user" />
                <p className={m.achiv_comment_item_text}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc.
                  Suspendisse porta metus sed sem aliquam, vitae rutrum turpis  maximus. Sed
                  fermentum quis erat rhoncus rhoncus. Suspendisse dui.
                </p>
              </li>
            </ul>
            <form className={m.achiv_comment_add}>
              <textarea className={m.achiv_comment_add_text} name="comment">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
                massa nunc. Suspendisse porta metus sed sem aliquam, vitae rutrum
                turpis  maximus. Sed fermentum quis erat rhoncus rhoncus.
                Suspendisse dui.
              </textarea>
              <button className={m.achiv_comment_add_btn}>Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BigCard;
