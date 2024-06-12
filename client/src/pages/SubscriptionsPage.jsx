import { useEffect, useState } from 'react';
import Header from '../components/header/header';
import More from '../components/more/more';
import SubscriptionCard from '../components/subscription-card/subscription-card';
import Subscriptions from '../components/subscriptions/subscriptions';
import { UrlServer } from "../App"
import axios from "axios";


function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])

  useEffect(() => {
    getSubscription()
  }, [])
  const getSubscription = async() => {
    const { data } = await axios.get(`http://${UrlServer()}/api/users/me/subscribe`, {
      headers: { 'x-access-token': localStorage.getItem('token') },
    })
    setSubscriptions(data)
  }

  return (
    <div>
      <Header />
      <Subscriptions />
      {subscriptions.map(subscription => <SubscriptionCard userData={subscription}/>)}
    </div>
  );
}

export default SubscriptionsPage;
