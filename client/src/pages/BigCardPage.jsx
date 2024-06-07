import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import BigCard from "../components/big-card/big-card";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function BigCardPage() {

  const params = useParams();
  const idUser = params.idUser;
  const idAchieve = params.idAchieve;
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      handleGetData();
    }
  }, []);

  const [achieve, setAchieve] = useState([]);
  const [photo, setPhoto] = useState()

  const handleGetData = () => {
    getDataPhoto();
    getDataAchieve();
  }

  const getDataPhoto = async () => {
    if(idUser !== "undefined") {
      const { data } = await axios.get(`http://localhost:4000/api/users/${idUser}`)
      data.portfolio.achievements.forEach(element => {
        if (element._id === idAchieve) {
          if (element.photo !== undefined) {
            getPhoto(element)
          }
        }
      });
    }
  }

  const getDataAchieve = async () => {
    const { data } = await axios.get(`http://localhost:4000/api/portfolios/achievement/${idAchieve}`)
    setAchieve(data)
  }

  const getPhoto = async (data) => {
    const img = await axios.get(`http://localhost:4000/api/content/photo/${data.photo}`, { responseType: "blob" })
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
  }

  const viewBigCard = () => {
    if (achieve.length !== 0) {
      return <BigCard dataCard={achieve} photo={photo} userId={idUser} achieveId={idAchieve} />
    }
  }

  return (
    <main class="container">
      <Header />
      {viewBigCard()}
    </main>
  );
}

export default BigCardPage;
