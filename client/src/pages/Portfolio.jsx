import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import UserCard from '../components/user-card/user-card';
import AddHeader from '../components/add-header/add-achievment'
import Card from '../components/card/card'
import More from "../components/more/more"

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPortfolio() {

  const navigate = useNavigate()

  useEffect(() => {
    try {
      if (localStorage.getItem('token')) {
        handleGetData()
      }
      else {
        navigate('/login')
      }
    }
    catch {
      navigate('/login')
    }
  }, []);

  const [userData, setDataPeple] = useState(null)
  const [dataProjects, setDataProjects] = useState([])

  const handleGetData = async () => {
    const { data } = await axios.get('http://localhost:4000/api/users/me', {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    setDataPeple(data)
    setDataProjects(data.portfolio.achievements)
  }

  return (
    <main class="container">
      <Header />
      <UserCard userData={userData} />
      <AddHeader isAdd={true} />
      {dataProjects.map(project => <Card idUser={userData._id} data={project} change={true} />)}
    </main>
  );
}

export default MyPortfolio;
