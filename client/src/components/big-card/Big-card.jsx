import './Big-card.css';
import people from "./../../img/people.png"
import achievment from "./../../img/achievment.png"
import { Link } from 'react-router-dom';

function Main({data}) {
  return (
    <main className="main">
      <section className="container">
        <div className="container-big-card-achiv">
          <Link className="link-exit" to='/'>Назад</Link>
          <div className="big-card-achiv-main-information">
            <div className="achiv-top flex">
              <div className="achiv-top-main-info flex">
                <img className="image-achiv" src={achievment} alt="achiv" />
                <div className="achiv-top-main-info-text">
                  <h2 className="achiv-title">{data.title}</h2>
                  <p className="achiv-descr-title">Описание</p>
                  <p className="achiv-descr-text">
                    {data.shortDescription}
                  </p>
                  <button className="btn btn-like" type="button">Понравилось</button>
                </div>
              </div>
              <div className="achiv-top-add-info">
                <ul className="achiv-top-add-info-list">
                  <li className="achiv-top-add-info-item">
                    <p className="achiv-descr-title">Подробное описание</p>
                    <p className="achiv-descr-text">
                      {data.fullDescription}
                    </p>
                  </li>
                  <li className="achiv-top-add-info-item">
                    <p className="achiv-descr-title">Ссылки</p>
                    <p className="achiv-descr-text">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc. Suspendisse porta
                      metus sed sem aliquam, vitae rutrum turpis  maximus. Sed fermentum quis erat rhoncus rhoncus.
                      Suspendisse dui.
                    </p>
                  </li>
                  <li className="achiv-top-add-info-item">
                    <p className="achiv-descr-title">Участники</p>
                    <img className="big-card-image-people" src={people} alt="Фото участника" />
                    <img className="big-card-image-people" src={people} alt="Фото участника" />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="achiv-comment">
            <h2 className="achiv-comment-title">Комментарии</h2>
            <ul className="achiv-comment-list">
              <li className="achiv-comment-item flex">
                <img className="achiv-comment-item-image" src={people} alt="people" />
                <p className="achiv-comment-item-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc.
                  Suspendisse porta metus sed sem aliquam, vitae rutrum turpis  maximus. Sed
                  fermentum quis erat rhoncus rhoncus. Suspendisse dui.
                </p>
              </li>
              <li className="achiv-comment-item flex">
                <img className="achiv-comment-item-image" src={people} alt="people" />
                <p className="achiv-comment-item-text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis  massa nunc.
                  Suspendisse porta metus sed sem aliquam, vitae rutrum turpis  maximus. Sed
                  fermentum quis erat rhoncus rhoncus. Suspendisse dui.
                </p>
              </li>
            </ul>
            <form className="achiv-comment-add flex">
              <textarea className="achiv-comment-add-text" name="comment"></textarea>
              <button className="btn btn-reset achiv-comment-add-btn">Отправить</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
