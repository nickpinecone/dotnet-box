import './Subs.css';

function Subscriptions() {
  return (
    <main className='subs-main'>
      <h1 className='subs-header'>Подписки</h1>
      <section className='subs-search'>
        <h2 className='subs-search-header'>Поиск</h2>
        <textarea className='subs-search-input'></textarea>
        <button className='find-subs'>Найти</button>
      </section>
    </main>
  );
}

export default Subscriptions;
