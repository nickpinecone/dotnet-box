import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import Edit from '../components/edit/edit'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditPage() {

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
    const { data } = await axios.get(`http://localhost:4000/api/users/${idUser}`)
    data.portfolio.achievements.forEach(element => {
      if (element._id === idAchieve) {
        if (element.photo !== undefined) {
          getPhoto(element)
        }
      }
    });
  }

  const getDataAchieve = async () => {
    const { data } = await axios.get(`http://localhost:4000/api/portfolios/achievement/${idAchieve}`)
    setAchieve(data)
  }

  const getPhoto = async (data) => {
    const img = await axios.get(`http://localhost:4000/api/photos/${data.photo}`, { responseType: "blob" })
    let url = URL.createObjectURL(img.data)
    setPhoto(url)
  }

  return (
    <main class="container">
      <Header />
      <Edit dataCard={achieve} idAchieve={idAchieve} />
    </main>
  );
}

export default EditPage;
