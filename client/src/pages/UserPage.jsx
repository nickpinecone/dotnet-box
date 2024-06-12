import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import UserCard from '../components/user-card/user-card';
import AddHeader from '../components/add-header/add-achievment'
import Card from '../components/card/card'
import More from "../components/more/more"
import profile from "../img/avatar.png"
import { UrlServer } from "../App"

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Portfolio() {
  const params = useParams();
  const idUser = params.idUser;
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
    const { data } = await axios.get(`http://${UrlServer()}/api/users/${idUser}`)
    setDataPeple(data)
    setDataProjects(data.portfolio.achievements)
    getPhoto(data)
  }

  const [photo, setPhoto] = useState();
  const getPhoto = async (info) => {
    if (info.avatar) {
      const img = await axios.get(`http://${UrlServer()}/api/content/photo/${info.avatar}`, { responseType: "blob" })
      let url = URL.createObjectURL(img.data)
      setPhoto(url)
    }
    else {
      setPhoto(profile)
    }
  }

  return (
    <main class="container">
      <Header />
      <UserCard userData={userData} photo={photo}/>
      <AddHeader />
      {dataProjects.map(project => <Card idUser={userData._id} data={project} />)}
    </main>
  );
}

export default Portfolio;
