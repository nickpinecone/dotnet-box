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
    const dataUsers = await axios.get('http://localhost:4000/api/portfolios/search')
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }

  return (
    <div>
      <Header />
      <Search />
      {data.map(achiv => <Card data={achiv} />)}
    </div>
  );
}

export default SearchPage;
