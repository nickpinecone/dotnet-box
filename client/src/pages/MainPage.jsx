import { useEffect, useState } from 'react';
import EnterHeader from '../components/enter-header/enter-header';
import Main from '../components/main/main';
import Search from '../components/search/search';
import Card from '../components/card/card';
import axios from 'axios';

function MainPage() {

  const [data, setData] = useState([])
  useEffect(() => {
    getAchieve()
  }, [])

  const getAchieve = async () => {
    const dataUsers = await axios.get('http://localhost:4000/api/portfolios/search')
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }

  return (
    <div>
      <EnterHeader />
      <Main />
      <Search />
      {data.map(achiv => <Card data={achiv} />)}
    </div>
  );
}

export default MainPage;
