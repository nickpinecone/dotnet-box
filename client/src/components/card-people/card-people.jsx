import './card-people.css'
import profile from "../../img/avatar.png"
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';

function CardPeople() {

    const [dataPeople, setDataPeple] = useState(null)

    const handleGetData = async () => {
        const {data} = await axios.get('http://localhost:4000/api/users/me',{
            headers: { 'x-access-token' : localStorage.getItem('token')},
          })
        setDataPeple(data)
    }

    useEffect(() => {
        handleGetData()
    }, [])

    
    if (!dataPeople){
        return <>loading...</>
    }
    return (
    <section class="main">
        <div class="profile-container">
            <img class="profile-image" src={profile} alt="ProfileImage" />

            <div class="profile">
                <h2 class="name">{dataPeople.username}</h2>

                <a class="login">{dataPeople._id}</a>

                <ul class="contact-list">
                    <li class="contact-list-item">
                        <a class="email" href={`mailto:${dataPeople.email}`}>{dataPeople.email}</a>
                    </li>

                    <li class="contact-list-item">
                        <a class="phone" to="tel:+79120000000"></a>
                    </li>

                    <li class="contact-list-item">
                        <a class="telegram"></a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="description">
          <h3 class="about-me">О себе</h3>

          <p class="text-about-me">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
            massa nunc. Suspendisse porta metus sed sem aliquam, vitae rutrum turpis
            maximus. Sed fermentum quis erat rhoncus rhoncus. Suspendisse dui.
          </p>
        </div>
    </section>
  );
}

export default CardPeople;