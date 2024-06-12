import { useNavigate } from 'react-router-dom';
import Header from '../components/header/header';
import profile from '../img/avatar.png'
// import Settings from '../components/settings/Settings'
import Settings from "../components/settings/settings";
import UserCard from '../components/user-card/user-card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UrlServer } from "../App"

function SettingsPage() {
  const navigate = useNavigate()

  useEffect(() => {
    try {
      if (localStorage.getItem('token')) {
        handleGetData()
      }
      else{
        navigate('/login')
      }
    }
    catch {
      navigate('/login')
    }
  }, []);

  const [userData, setDataPeple] = useState([])
  const [photo, setPhoto] = useState();

  const handleGetData = async () => {
    const { data } = await axios.get(`http://${UrlServer()}/api/users/me`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    setDataPeple(data)
    getPhoto(data)
  }

  const getPhoto = async(info) => {
    if(info.avatar){
      const img = await axios.get(`http://${UrlServer()}/api/content/photo/${info.avatar}`, { responseType: "blob" })
      let url = URL.createObjectURL(img.data)
      setPhoto(url)
    }
    else{
      setPhoto(profile)
    }
  }

  return (
    <div>
      <Header />
      <Settings userData={userData} photo={photo}/>
    </div>
  );
}

export default SettingsPage;
