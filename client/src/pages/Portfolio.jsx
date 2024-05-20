import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import UserCard from '../components/user-card/user-card';
import AddHeader from '../components/add-header/add-achievment'
import Card from '../components/card/card'
import profile from "../img/avatar.png"
// import More from "../components/more/More"
import More from "../components/more/more"

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyPortfolio() {
  const navigate = useNavigate()
  const query = new URLSearchParams(window.location.href);

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        handleGetData();
      }
      else {
        let payload = "";

        query.forEach((value) => {
          payload = value;
        });

        if (payload !== "") {
          handleVkPayload(payload);
        }
        else {
          navigate("/login");
        }
      }
    }
    catch {
      navigate('/login')
    }
  }, []);

  const [userData, setDataPeple] = useState(null)
  const [dataProjects, setDataProjects] = useState([])
  const [photo, setPhoto] = useState();

  const handleVkPayload = async (payload) => {
    let payloadData = JSON.parse(payload);
    const { data } = await axios.post('http://localhost:4000/api/users/loginVK', {
      silentToken: payloadData.token,
      uuid: payloadData.uuid,
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("id", data.user._id);

    handleGetData();
  }

  const handleGetData = async () => {
    const { data } = await axios.get('http://localhost:4000/api/users/me', {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    setDataPeple(data)
    setDataProjects(data.portfolio.achievements)
    getPhoto(data)
  }

  const getPhoto = async (info) => {
    if (info.avatar) {
      const img = await axios.get(`http://localhost:4000/api/photos/${info.avatar}`, { responseType: "blob" })
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
      <UserCard userData={userData} photo={photo} />
      <AddHeader isAdd={true} />
      {dataProjects.map(project => <Card idUser={userData._id} data={project} change={true} />)}
    </main>
  );
}

export default MyPortfolio;
