import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import Edit from '../components/edit/edit'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UrlServer } from "../App"

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
    getDataAchieve();
  }

  const getDataAchieve = async () => {
    const { data } = await axios.get(`http://${UrlServer()}/api/portfolios/achievement/${idAchieve}`)
    setAchieve(data)
  }

  return (
    <main class="container">
      <Header />
      <Edit dataCard={achieve} idAchieve={idAchieve} />
    </main>
  );
}

export default EditPage;
