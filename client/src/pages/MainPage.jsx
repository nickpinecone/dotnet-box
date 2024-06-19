import { useEffect, useState } from 'react';
import EnterHeader from '../components/enter-header/enter-header';
import Main from '../components/main/main';
import Search from '../components/search/search';
import Card from '../components/card/card';
import axios from 'axios';
import { UrlServer } from "../App"
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const navigate = useNavigate()
  const query = new URLSearchParams(window.location.href);

  const [data, setData] = useState([])
  useEffect(() => {
    getAchieve()

    let payload = "";

    query.forEach((value) => {
      payload = value;
    });

    if (payload !== "") {
      handleVkPayload(payload);
    }

  }, [])

  const handleVkPayload = async (payload) => {
    let payloadData = JSON.parse(payload);
    const { data } = await axios.post(`http://${UrlServer()}/api/users/loginVK`, {
      silentToken: payloadData.token,
      uuid: payloadData.uuid,
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("id", data.user._id);

    navigate("/myPortfolio");
  }

  const getAchieve = async () => {
    const dataUsers = await axios.get(`http://${UrlServer()}/api/portfolios/search`)
    console.log(dataUsers.data)
    setData(dataUsers.data)
  }

  return (
    <div className='container__for__footer'>
      <EnterHeader />
      <Main />
      <Search />
    </div>
  );
}

export default MainPage;
