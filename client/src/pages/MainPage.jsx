import { useEffect, useState } from 'react';
import EnterHeader from '../components/enter-header/enter-header';
import Main from '../components/main/main';
import Search from '../components/search/search';
import Card from '../components/card/card';
import axios from 'axios';
import { UrlServer } from "../App"

function MainPage() {

  const [data, setData] = useState([])
  useEffect(() => {
    getAchieve()
  }, [])

  const getAchieve = async () => {
    const dataUsers = await axios.get(`http://${UrlServer()}/api/portfolios/search`)
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }

  return (
    <div>
      <EnterHeader />
      <Main />
      <Search />
    </div>
  );
}

export default MainPage;
