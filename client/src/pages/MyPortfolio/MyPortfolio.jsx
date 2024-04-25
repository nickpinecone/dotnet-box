import { useEffect, useState } from 'react';
import Header from '../../components/header/header';
import CardPeople from '../../components/card-people/card-people';
import Card from '../../components/card/Achievment'
import LinkAddAchiv from '../../components/link-add-achiv/add'
import More from '../../components/more/More'
import './MyPortfolio.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPortfolio() {

  const navigate = useNavigate()

  useEffect(() => {
    try{
      if(!localStorage.getItem('token')){
        navigate('/login')
      }
      handleGetData()
    }
    catch{
      navigate('/login')
    }
  }, []);

    const [dataPeople, setDataPeple] = useState(null)
    const [dataProjects, setDataProjects] = useState([])

    const handleGetData = async () => {
        const {data} = await axios.get('http://localhost:4000/api/users/me',{
            headers: { 'x-access-token' : localStorage.getItem('token')},
          })
        setDataPeple(data)
        setDataProjects(data.portfolio.achievements)
    }

    return (
      <main class="container">
        <Header/>
        <CardPeople dataPeople={dataPeople}/>
        <LinkAddAchiv/>
        {dataProjects.map(project => <Card data={project}/>)}
        <More/>
      </main>
    );
  }

export default MyPortfolio;