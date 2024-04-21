import { useEffect } from 'react';
import Header from '../../components/header/header';
import CardPeople from '../../components/card-people/card-people';
import './MyPortfolio.css'
import { useNavigate } from 'react-router-dom';

function MyPortfolio() {

  const navigate = useNavigate()

  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/login')
    }
  }, []);

    return (
      <main class="container">
        <Header/>
        <CardPeople/>
      </main>
    );
  }

export default MyPortfolio;