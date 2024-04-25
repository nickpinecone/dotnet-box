import { useEffect, useState } from 'react';
import FindComponent from '../../components/find-page/Find'
import Header from '../../components/header/header';
import Card from '../../components/card/Achievment'

import './Find.css'
import axios from 'axios';



function Find() {

  const [data, setData] = useState([])
  useEffect(() => {
    getAchieve()
  }, [])

  const getAchieve = async() => {
    const dataUsers = await axios.get('http://localhost:4000/api/portfolios/')
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }
    return (
      <main class="container">
        <Header/>
        <FindComponent/>
        {data.map(portfolio => portfolio.achievements.map(achieve => <Card data={achieve}/>))}
      </main>
    );
  }

export default Find;