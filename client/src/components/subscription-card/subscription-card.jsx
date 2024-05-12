import m from './subscription-card.module.css';
import profile from "./../../img/people.png"

function SubscriptionCard() {
  return (
    <div className={m.card}>
      <section className={m.element}>
        <img className={m.picture} src={profile} />
        <div className={m.text}>
          <p className={m.text_title}>Попов Андрей</p>
          <p >Всем привет! Люблю занималься аналитикой!</p>
        </div>
        <a className={m.unsubscribe}>Отписаться</a>
      </section>
    </div>
  );
}

export default SubscriptionCard;
