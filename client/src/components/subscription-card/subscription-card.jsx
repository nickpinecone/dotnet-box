import m from './subscription-card.module.css';
import profile from "./../../img/people.png"

function SubscriptionCard() {
  return (
    <div className={m.card}>
      <section className={m.element}>
        <img className={m.picture} src={profile} />
        <p className={m.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis massa nunc.</p>
        <a className={m.unsubscribe}>Отписаться</a>
      </section>
    </div>
  );
}

export default SubscriptionCard;
