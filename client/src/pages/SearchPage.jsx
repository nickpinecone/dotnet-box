import { useEffect, useState } from 'react';
import Header from './../components/header/header';
import Search from './../components/search/search';
import Card from './../components/card/card';
import axios from 'axios';

function SearchPage() {

  const [data, setData] = useState([])
  useEffect(() => {
    getAchieve()
  }, [])

  const getAchieve = async () => {
    const dataUsers = await axios.get('http://localhost:4000/api/portfolios/')
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }

  return (
    <div>
      <Header />
      <Search />
      {data.map(portfolio => portfolio.achievements.map(achieve => <Card data={achieve} />))}
    </div>
  );
}

export default SearchPage;
