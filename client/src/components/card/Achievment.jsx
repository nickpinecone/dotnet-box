import './Achievment.css';
import image from "./../../img/achievment.png";
import { NavLink } from 'react-router-dom';

function Achievment({data}) {
  return (
    <main>
      <section className="achievment-container">
        <img className="achievment-image" src={image} alt="Achievment image" />
        <section className="achievment-words">
          <h2 className="achievment-name">{data.description}</h2>
          <h3 className="achievment-description">{data.url}</h3>
          <p className="achievment-text">
            {data.url}
          </p>
          <NavLink className="details" to={`/${data.portfolio}/${data._id}`}>Подробнее</NavLink>
        </section>
      </section>
    </main>
  );
}

export default Achievment;
