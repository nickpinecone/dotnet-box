import m from './subscriptions.module.css';

function Subscriptions() {
  return (
    <main className={m.subs_main}>
      <section className={m.subs_search}>
        <h2 className={m.subs_search_header}>Поиск</h2>
        <input className={m.subs_search_input}></input>
        <button className={m.find_subs}>Найти</button>
      </section>
    </main>
  );
}

export default Subscriptions;
