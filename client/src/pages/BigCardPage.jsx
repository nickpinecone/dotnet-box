import { useEffect, useState } from 'react';
import Header from '../components/header/header';
// import BigCard from '../components/big-card/Big-card'
import BigCard from "../components/big-card/big-card";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function BigCardPage() {

  const params = useParams();
  const idUser = params.idUser;
  const idAchieve = params.idAchieve;
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
    handleGetData();
  }, []);


  const [achieve, setAchieve] = useState([]);
  const [photo, setPhoto] = useState()

  const handleGetData = async () => {
    const { data } = await axios.get(`http://localhost:4000/api/users/${idUser}`)
    data.portfolio.achievements.forEach(element => {
      if (element._id === idAchieve) {
        setAchieve(element)
        console.log(element)
        if (element.photo !== undefined) {
          getPhoto(element)
        }
      }
    });
  }

  const getPhoto = async (data) => {
    console.log(data.photo)
    const img = await axios.get(`http://localhost:4000/api/photos/${data.photo}`, { responseType: "blob" })
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
  }

  return (
    <main class="container">
      <Header />
      <BigCard data={achieve} photo={photo}/>
    </main>
  );
}

export default BigCardPage;
